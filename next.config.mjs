/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/licenta", // numele repo-ului tău, cu slash la început
  assetPrefix: "/licenta/", // important pentru stiluri și resurse
  images: {
    unoptimized: true, // necesar pentru export static cu imagini
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
