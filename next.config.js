const withPWA = require("next-pwa")({
  dest: "public", // The destination folder for the service worker (sw.js)
  register: true, // Auto-register the service worker
  skipWaiting: true, // Activate the new service worker immediately
  disable: process.env.NODE_ENV === "development", // Optional: disable PWA in development
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // ⚠️ WARNING: This allows images from *any* domain.
        // Highly discouraged for production environments due to security risks.
        protocol: "http", // Use this if you need http images
        hostname: "**", // Wildcard for all subdomains and hosts
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https", // Use this if you need https images
        hostname: "**", // Wildcard for all subdomains and hosts
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
