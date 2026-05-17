import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is disabled by default in Next.js 16 when using custom webpack config.
  turbopack: {},
  webpack: (config) => {
    // Disable symlinks resolution to bypass buggy readlink calls on Windows
    if (config.resolve) {
      config.resolve.symlinks = false;
    }
    return config;
  },
};

export default nextConfig;
