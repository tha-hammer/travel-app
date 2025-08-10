module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        alias: {
          '@models': './app/models',
          '@services': './app/services',
          '@controllers': './app/controllers',
          '@views': './app/views',
          '@tests': './app/tests',
        },
      },
    ],
  ],
};
