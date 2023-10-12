/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@libsql/isomorphic-fetch'],
  },
  images: {
    domains: ['detroittitans.com'],
  },
}

export default nextConfig
