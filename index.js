const { loadDebug, getTargetName } = require('./loader');
require('./targets');

module.exports = loadDebug(__dirname)
  || require(`@neon-prebuild-example/${getTargetName()}`);
