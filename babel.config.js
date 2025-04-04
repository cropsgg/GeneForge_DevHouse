module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add React Native reanimated plugin if you're using it
      'react-native-reanimated/plugin',
      // Add any additional plugins your project needs
    ],
  };
}; 