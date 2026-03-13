/** @type {import('next').NextConfig} */
const isProductionBuild = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  distDir: isProductionBuild ? ".next" : ".next-cache",
  output: isProductionBuild ? "export" : undefined,
  trailingSlash: isProductionBuild,
  experimental: {
    optimizePackageImports: ["framer-motion"]
  },
  images: {
    unoptimized: true
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: "memory"
      };
    }

    return config;
  }
};

export default nextConfig;
