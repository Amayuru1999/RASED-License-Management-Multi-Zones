import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    externalDir: true,
  },
  basePath: '/licenses',
  assetPrefix: '/licenses',
  transpilePackages: ['rased-shared-ui'],
}

export default nextConfig
