/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false, // Disable strict mode to prevent double rendering in development
  compiler: {
    // Remove React-specific attributes to prevent hydration mismatch
    reactRemoveProperties: { properties: ['^data-windsurf-'] },
  },
}

export default nextConfig
