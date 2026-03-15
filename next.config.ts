import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGhPages ? "/hakamada-inventory" : "",
  assetPrefix: isGhPages ? "/hakamada-inventory/" : "",
};

export default nextConfig;
