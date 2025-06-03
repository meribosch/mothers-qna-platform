/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    optimizeCss: true
  },
  typescript: {
    // Comment out for production
    // ignoreBuildErrors: true
  },
  eslint: {
    // Comment out for production
    // ignoreDuringBuilds: true
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
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