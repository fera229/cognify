import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    typedRoutes: true,
  },
  images: {
    domains: ['utfs.io'],
  },
};

export default nextConfig;
