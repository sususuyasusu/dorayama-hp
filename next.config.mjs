/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.SITE_BASE ?? '/dorayama-hp',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
