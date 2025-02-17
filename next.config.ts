import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["127.0.0.1", "localhost"],
  },
};

export default nextConfig;
