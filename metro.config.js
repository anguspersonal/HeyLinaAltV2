const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable tree shaking and minification
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      // Drop console statements in production
      drop_console: true,
    },
  },
};

// Keep default resolver settings for better compatibility
// Removed disableHierarchicalLookup as it was causing module resolution issues

module.exports = config;
