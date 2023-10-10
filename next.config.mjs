/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    domains: ['detroittitans.com'],
  },
}

export default nextConfig
