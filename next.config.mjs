/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/licenta", // dacă vrei să fie accesibil pe https://username.github.io/repo
  images: {
    unoptimized: true, // important pt export static
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
