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
};

module.exports = withContentlayer(nextConfig);