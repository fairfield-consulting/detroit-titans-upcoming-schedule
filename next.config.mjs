/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@libsql/client',
      '@libsql/isomorphic-fetch',
    ],
  },
  images: {
    domains: ['detroittitans.com'],
  },
}

export default nextConfig
