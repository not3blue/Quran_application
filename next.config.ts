import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Disable Turbopack persistent cache during development
  experimental: {
    // Use webpack instead of Turbopack for now
  },
  // Allow cross-origin requests from preview panel
  allowedDevOrigins: [
    'preview-chat-c5f7ed1a-5204-49da-9d53-a8eaa5175faf.space.z.ai',
    '.space.z.ai',
    'localhost',
  ],
};

export default nextConfig;
