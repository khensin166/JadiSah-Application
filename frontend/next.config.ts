import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: standalone membuat Next.js menghasilkan folder yang bisa dijalankan
  // secara mandiri tanpa perlu install seluruh node_modules di server (lebih ringan)
  output: "standalone",
};

export default nextConfig;
