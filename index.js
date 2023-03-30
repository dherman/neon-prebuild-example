const { loadDebug, getTargetName } = require('./loader');

// Dynamic require for runtime.
module.exports = loadDebug(__dirname) || require(`@neon-prebuild-example/${getTargetName()}`);

// Static requires for bundlers.
if (0) require('./.static');
