/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // plugins: true,
    // optimizeImages: true,
    optimizeCss: true,

  },
}

module.exports = nextConfig
