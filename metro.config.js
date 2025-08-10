const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      '@models': path.resolve(__dirname, 'app/models'),
      '@services': path.resolve(__dirname, 'app/services'),
      '@controllers': path.resolve(__dirname, 'app/controllers'),
      '@views': path.resolve(__dirname, 'app/views'),
      '@tests': path.resolve(__dirname, 'app/tests'),
    },
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
