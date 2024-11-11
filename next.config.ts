import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/submitQuery',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
