/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.anixart.tv',
      },
      {
        protocol: 'https',
        hostname: 's.anixmirai.com',
      },
      {
        protocol: 'https',
        hostname: 's3.anixmirai.com',
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig

