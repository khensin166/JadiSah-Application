import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: standalone membuat Next.js menghasilkan folder yang bisa dijalankan
  // secara mandiri tanpa perlu install seluruh node_modules di server (lebih ringan)
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
