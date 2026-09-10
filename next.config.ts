import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
