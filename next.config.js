/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: '/',
      headers: [
        {
          key: 'Cache-Control',
          value: 's-maxage=86400, stale-while-revalidate=3600',
        },
      ],
    },
  ],
  images: {
    domains: ['detroittitans.com'],
  },
}

module.exports = nextConfig
