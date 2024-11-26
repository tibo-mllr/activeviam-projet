import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
