/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false ,
    images: { domains: ["lh3.googleusercontent.com", "images.pexels.com" , "res.cloudinary.com"] } ,
    experimental: {
        serverActions: true,
      },
}

module.exports = nextConfig
