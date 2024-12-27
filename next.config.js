/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    experimental: {
        mdxRs: true,
    },
    images: {
        domains: [
            "images.unsplash.com",
            "github.com",
            "avatars.githubusercontent.com",
        ],
    },
}

const withMDX = require('@next/mdx')()
module.exports = withMDX(nextConfig)