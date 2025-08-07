/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuración para GitHub Pages
  output: 'export',
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/recipe-shopping-app' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/recipe-shopping-app' : '',
}

export default nextConfig
