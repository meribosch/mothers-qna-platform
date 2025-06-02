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
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
  },
  // Disable static optimization for dynamic routes
  experimental: {
    optimizeCss: true
  },
  // Configure dynamic routes
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: '/auth/:path*',
      },
      {
        source: '/questions/:path*',
        destination: '/questions/:path*',
      }
    ]
  }
}

module.exports = nextConfig 