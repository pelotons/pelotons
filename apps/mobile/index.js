// URL polyfill MUST be loaded first - using require() to ensure synchronous execution
// ES6 imports are hoisted and can execute in unexpected order with Metro bundler
require('react-native-url-polyfill/auto');

// Now that polyfill is loaded, we can safely import the rest of the app
const { registerRootComponent } = require('expo');
const { default: App } = require('./App');

registerRootComponent(App);
