/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    optimizeCss: true
  },
  typescript: {
    ignoreBuildErrors: true // Only for development, remove in production
  },
  eslint: {
    ignoreDuringBuilds: true // Only for development, remove in production
  }
}

module.exports = nextConfig 