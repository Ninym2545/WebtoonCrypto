/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false ,
    images: { domains: ["lh3.googleusercontent.com", "images.pexels.com"] } ,
    experimental: {
        serverActions: true,
      },
}

module.exports = nextConfig
