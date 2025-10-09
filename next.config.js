/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        // ⚠️ WARNING: This wildcard allows images from *any* domain.
        // Use this ONLY if you fully understand and accept the security risks.
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
