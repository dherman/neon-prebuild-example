const { debug, target } = require('neon-prebuild');

// Static requires for bundlers.
if (0) { require('./.prebuilds'); }

// Dynamic require for runtime.
module.exports = debug(__dirname) || require(`@neon-prebuild-example/${target()}`);
