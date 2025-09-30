module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@assets': './src/assets',
            '@components': './src/components',
            '@contexts': './src/contexts',
            '@DAOs': './src/storage/_DAOs',
            '@DTOs': './src/storage/_DTOs',
            '@hooks': './src/hooks',
            '@router': './src/router',
            '@screens': './src/screens',
            '@services': './src/services',
            '@storage': './src/storage',
            '@theme': './src/theme',
            '@utils': './src/utils',
            '@routes': './src/routes',
          },
        },
      ],
    ],
  };
};
