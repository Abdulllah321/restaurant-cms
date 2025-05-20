import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "ykdzukekehydivzkkumo.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/images/**", // ✅ Add this!
      },
    ],
  },
};

export default nextConfig;
