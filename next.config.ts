import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    if (config.output) {
      config.output.environment = {
        ...config.output.environment,
        asyncFunction: true,
      };
    }
    return config;
  },
};

export default nextConfig;
