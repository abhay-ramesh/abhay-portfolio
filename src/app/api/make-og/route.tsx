import { ImageResponse } from "next/og";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // ?title=<title>
  const hasTitle = searchParams.has("title");
  const title = hasTitle ? searchParams.get("title") : "Abhay Ramesh";
  const tags = searchParams.get("tags")?.split(",") || [];

  if (!title) {
    return new Response("Missing title parameter", { status: 400 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: 60,
          position: "relative",
        }}
      >
        {/* Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            zIndex: 1,
            width: "100%",
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 64,
                color: "white",
                lineHeight: 1.1,
                marginBottom: 24,
              }}
            >
              {title}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 20,
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Author Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 1,
          }}
        >
          {/* Author Image */}
          <img
            src="https://github.com/abhay-ramesh.png"
            alt="Abhay Ramesh"
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
            }}
          />
          {/* Author Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "white",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 600 }}>Abhay Ramesh</div>
            <div style={{ fontSize: 16, opacity: 0.6 }}>
              Full Stack Developer
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
