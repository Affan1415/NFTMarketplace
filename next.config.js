/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  webpack: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false }

    return config;
  },
  images: {
    domains: ['ipfs']
  },
  
}
