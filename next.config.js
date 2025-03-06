// @ts-check
const { i18n } = require('./next-i18next.config.js')

// You can remove the following 2 lines when integrating our example.
const { loadCustomBuildParams } = require('./next-utils.config')
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
    // Handle CSS imports from @uiw/react-md-editor
    // config.module.rules.push({
    //   test: /\.css$/i,
    //   issuer: { and: [/\.(js|ts|md)x?$/] },
    //   use: ['style-loader', 'css-loader'],
    // });

    // This is necessary for the markdown editor to work properly
    config.resolve.fallback = { fs: false };

    return config;
  },
}

module.exports = nextConfig
