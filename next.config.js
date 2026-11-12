/** @type {import('next').NextConfig} */

// Vercel serves files in /public with "max-age=0, must-revalidate" by default, so the
// browser re-checks every photo and song on each visit. Let the browser/CDN keep them.
const longCache = [
  { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
]

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      { source: '/music/:path*', headers: longCache },
      { source: '/photos/:path*', headers: longCache },
      { source: '/:all*(webp)', headers: longCache },
    ]
  },
}

module.exports = nextConfig
