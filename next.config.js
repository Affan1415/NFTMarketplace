/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

//const { config } = require('hardhat');

//module.exports = nextConfig

module.exports = {
  reactStrictMode: false,
  webpack: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false }

    return config;
  },
}
