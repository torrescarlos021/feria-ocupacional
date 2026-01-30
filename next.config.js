/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['replicate.delivery', 'api.replicate.com'],
  },
}

module.exports = nextConfig
