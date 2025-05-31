import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: Record<string, unknown>) => (rule as { test?: RegExp }).test?.test?.('.svg'));
  if (fileLoaderRule) {
    fileLoaderRule.exclude = /\.svg$/;
  }

  config.module.rules.push({
    test: /\.svg$/,
    issuer: {
      and: [/\.(ts|tsx|js|jsx)$/]
    },
    use: ['@svgr/webpack'],
  });

    return config;
  },
};

export default nextConfig;
