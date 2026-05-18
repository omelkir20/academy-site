import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/users/:path*",     destination: `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api","") || "http://user-service:3001"}/api/v1/:path*` },
      { source: "/api/courses/:path*",   destination: `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api","") || "http://course-service:8001"}/api/v1/:path*` },
      { source: "/api/analytics/:path*", destination: `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api","") || "http://analytics-service:8002"}/api/v1/:path*` },
      { source: "/api/ai-tutor/:path*",  destination: `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api","") || "http://ai-tutor-service:8003"}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
