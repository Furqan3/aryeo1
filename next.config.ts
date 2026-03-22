/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build', // instead of .next
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**aryeo.com', // allows aryeo.com and subdomains
      },
      {
        protocol: 'https',
        hostname: '**cdn.aryeo.com',
      },
    ],
  },
};

export default nextConfig;
