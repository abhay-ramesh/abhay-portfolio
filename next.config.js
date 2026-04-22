const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "images.unsplash.com",
            "github.com",
            "avatars.githubusercontent.com",
        ],
    },
    async headers() {
        const linkHeader = [
            '<https://abhayramesh.com/>; rel="canonical"',
            '<https://abhayramesh.com/sitemap.xml>; rel="sitemap"; type="application/xml"',
            '<https://abhayramesh.com/blog>; rel="index"; title="Blog"',
            '<https://abhayramesh.com/#contact>; rel="author"',
            '<https://github.com/abhay-ramesh>; rel="me"',
            '<https://www.linkedin.com/in/abhay-ramesh/>; rel="me"',
            '<https://twitter.com/abhay__ramesh>; rel="me"',
        ].join(", ");
        return [
            {
                source: "/",
                headers: [{ key: "Link", value: linkHeader }],
            },
        ];
    },
};

module.exports = withContentlayer(nextConfig);