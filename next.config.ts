import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg", "bcryptjs", "@prisma/client"],
  images: {
    qualities: [75, 85],
  },
};

export default nextConfig;
