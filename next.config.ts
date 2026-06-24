import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
    // Allow data: URIs for locally uploaded avatars/media stored as base64
    dangerouslyAllowSVG: false,
    unoptimized: false,
  },
};

export default nextConfig;
