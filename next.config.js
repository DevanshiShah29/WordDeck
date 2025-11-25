const withPWA = require("next-pwa")({
  dest: "public", // The destination folder for the service worker (sw.js)
  register: true, // Auto-register the service worker
  skipWaiting: true, // Activate the new service worker immediately
  disable: process.env.NODE_ENV === "development", // Optional: disable PWA in development
});
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

module.exports = withPWA(nextConfig);
