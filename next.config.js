import { loadCustomBuildParams } from './next-utils.config.js';
const { esmExternals = false, tsconfigPath } =
  loadCustomBuildParams()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals,
  },

  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  reactStrictMode: true,
  typescript: {
    tsconfigPath,
  },
  webpack: (config) => {

    config.resolve.fallback = { fs: false };

    return config;
  },
}

export default nextConfig
