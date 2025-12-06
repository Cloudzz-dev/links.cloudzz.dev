import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from uploads directory to be served
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'links.cloudzz.dev',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
    // Use unoptimized for dynamic local uploads (files added at runtime)
    unoptimized: true,
  },
  output: "standalone",
};

export default nextConfig;
