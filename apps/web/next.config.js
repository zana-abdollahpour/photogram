/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: process.env.BACKEND_HOST,
        protocol: process.env.BACKEND_PROTOCOL,
      },
    ],
  },
};

export default nextConfig;
