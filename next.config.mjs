/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@libsql/client', '@libsql/isomorphic-fetch'],
  images: {
    domains: ['detroittitans.com'],
  },
}

export default nextConfig
