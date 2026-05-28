import type { NextConfig } from "next";
import path from "path";

const prismaClientEntry = path.join(
  __dirname,
  "src/generated/prisma/client.ts",
);

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg", "bcryptjs", "@prisma/client"],
  images: {
    qualities: [75, 85],
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/generated/prisma": prismaClientEntry,
      "@/generated/prisma/client": prismaClientEntry,
    };
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default nextConfig;
