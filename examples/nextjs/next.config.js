const withPreconstruct = require('@preconstruct/next');
const { patchWebpackConfig } = require('next-global-css');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    if (process.env.CYPRESS === 'true') {
      //Allows importing the global.css file in cypress/support/component.ts
      patchWebpackConfig(config, options);
    }
    return config;
  },
};

module.exports = withPreconstruct({ ...nextConfig });
