/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/whattoeat',
  assetPrefix: '/whattoeat',
};

module.exports = nextConfig;