import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lets a production preview build into its own folder while `next dev` keeps using .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
