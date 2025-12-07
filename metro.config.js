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

// Optimize resolver
config.resolver = {
  ...config.resolver,
  // Disable symlinks to improve performance
  disableHierarchicalLookup: true,
};

module.exports = config;
