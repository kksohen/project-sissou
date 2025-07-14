import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    taint: true //server 측 코드 client에서 볼 수X
  },
  logging: {
    fetches: {
      fullUrl: true //외부 api 호출시 hit, skip 여부 상세보기
    }
  },
  images: {
    remotePatterns: [
      {
      hostname: "k.kakaocdn.net"
      },
      {
      hostname: "ssl.pstatic.net"
      },
      {
      hostname: "lh3.googleusercontent.com"
      },
      {
      hostname: "avatars.githubusercontent.com"
      },
      {
      hostname: "imagedelivery.net"
      },
  ]
  },
  webpack(config){
    const fileLoaderRule = config.module.rules.find((rule: Record<string, unknown>) => (rule as { test?: RegExp }).test?.test?.('.svg'));
  if (fileLoaderRule) {
    fileLoaderRule.exclude = /\.svg$/;
  };

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
