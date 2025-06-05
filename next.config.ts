import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fmbwoqdvvbcgicdotadw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // adjust if needed
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // match all paths
      },
    ],
  },
};

export default nextConfig;