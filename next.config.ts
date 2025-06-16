import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fmbwoqdvvbcgicdotadw.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // ✅ Recommended for static image links
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // ✅ Optional: more reliable placeholder service
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;