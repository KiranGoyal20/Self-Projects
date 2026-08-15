import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  output: "export",
  assetPrefix: ".",
};

export default nextConfig;
