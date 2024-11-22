import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/submit-query',
        destination: '/submitQuery',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/submit-query',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
