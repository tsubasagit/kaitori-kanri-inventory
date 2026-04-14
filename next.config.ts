import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGhPages ? "/kaitori-kanri-inventory" : "",
  assetPrefix: isGhPages ? "/kaitori-kanri-inventory/" : "",
  experimental: {
    workerThreads: false,
    cpus: 2,
  },
};

export default nextConfig;
