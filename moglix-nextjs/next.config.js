/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.moglimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.moglix.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
