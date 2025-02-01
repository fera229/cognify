import type { Configuration } from 'webpack';
import type { NextConfig } from 'next';
import { setEnvironmentVariables } from './util/config';

setEnvironmentVariables();

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    typedRoutes: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['utfs.io'],
  },
  async headers() {
    return [];
  },
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        perf_hooks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
