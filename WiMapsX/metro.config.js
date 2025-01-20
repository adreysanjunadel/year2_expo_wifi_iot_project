const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  return {
    ...defaultConfig,
    resolver: {
      ...defaultConfig.resolver,
      resolveRequest: (context, realModuleName, platform) => {
        if (realModuleName === 'axios') {
            return context.resolveRequest(context, 'axios/index.js', platform);
          }
         if (realModuleName === 'module:expo-font') {
            return context.resolveRequest(context, 'expo-font', platform)
        }
          return context.resolveRequest(context, realModuleName, platform);
         },
    },
   };
})();