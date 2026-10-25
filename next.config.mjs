/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/dorayama-hp',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
