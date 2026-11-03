import type { NextConfig } from "next";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
// Membersihkan trailing slash atau akhiran /api agar tidak terjadi duplikasi (/api/api/...)
const baseApiUrl = rawApiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // output: standalone membuat Next.js menghasilkan folder yang bisa dijalankan
  // secara mandiri tanpa perlu install seluruh node_modules di server (lebih ringan)
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${baseApiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
