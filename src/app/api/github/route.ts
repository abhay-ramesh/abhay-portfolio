import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

// Server-only: GITHUB_TOKEN must NOT have a NEXT_PUBLIC_ prefix, or Next.js
// will inline it into the client bundle. Use a fine-grained token with
// "Public repositories (read-only)" access and no extra permissions.
const GITHUB_LOGIN = "abhay-ramesh";
const REVALIDATE_SECONDS = 86400; // refresh from GitHub at most once a day
const STALE_SECONDS = 604800; // CDN may serve the last good copy for a week

// Rendered per request (cheap: data comes from the cache below). This keeps
// builds from calling GitHub, so the token is only needed at runtime.
export const dynamic = "force-dynamic";

const QUERY = `query ($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          stargazerCount
          url
          primaryLanguage { name }
          forkCount
          isFork
          homepageUrl
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays { contributionCount date }
        }
      }
    }
  }
}`;

type Level = 0 | 1 | 2 | 3 | 4;

function getContributionLevel(count: number): Level {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

// Only successful results are cached: any failure throws, and unstable_cache
// does not store thrown errors, so a GitHub outage or bad token is retried
// on the next request instead of being cached for a day.
const getGitHubProfile = unstable_cache(
  async () => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is not set");

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_LOGIN } }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);

    const json = await res.json();
    const user = json?.data?.user;
    if (!user) throw new Error("GitHub API returned no user data");

    const pinnedRepos = (user.pinnedItems?.nodes ?? []).map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      stargazers_count: repo.stargazerCount,
      html_url: repo.url,
      language: repo.primaryLanguage?.name || "Unknown",
      forks_count: repo.forkCount,
      fork: repo.isFork,
      homepage: repo.homepageUrl,
    }));

    const weeks = user.contributionsCollection?.contributionCalendar?.weeks ?? [];
    const contributions = weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: getContributionLevel(day.contributionCount),
      })),
    );

    return { pinnedRepos, contributions };
  },
  ["github-profile", GITHUB_LOGIN],
  { revalidate: REVALIDATE_SECONDS },
);

export async function GET() {
  try {
    const data = await getGitHubProfile();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=3600, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}, stale-if-error=${STALE_SECONDS}`,
      },
    });
  } catch (err) {
    // Log server-side only; never echo GitHub's error or token details.
    console.error("GitHub profile fetch failed:", (err as Error).message);
    return NextResponse.json(
      { pinnedRepos: [], contributions: [] },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
