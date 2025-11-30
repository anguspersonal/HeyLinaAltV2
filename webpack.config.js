const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native-web/src/modules/warnOnce': path.resolve(
      __dirname,
      'overrides/react-native-web/warnOnce.js'
    ),
  };

  return config;
};
