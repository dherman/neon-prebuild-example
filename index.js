const { debug, currentTarget } = require('@neon-rs/load');

// Static requires for bundlers.
if (0) { require('./.targets'); }

// Dynamic require for runtime.
module.exports = debug(__dirname) || require(`@neon-prebuild-example/${currentTarget()}`);
