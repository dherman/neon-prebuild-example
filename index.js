const fs = require('fs');
const path = require('path');

function getLinuxAbi() {
  return process.report.getReport().header.glibcVersionRuntime ? 'gnu' : 'musl';
}

function getTargetName() {
  switch (process.platform) {
    case 'win32':
      return `win32-${process.arch}-msvc`;
    case 'darwin':
      return `darwin-${process.arch}`;
    case 'linux':
      return `linux-${process.arch}-${getLinuxAbi()}`;
    default:
      throw new Error(`failed to load Neon module: unsupported platform ${process.platform}`);
  }
}

function getPrebuiltModuleName(scope, target) {
  return `@${scope}/${target}`;
}

if (fs.existsSync(path.join(__dirname, "debug.node"))) {
  module.exports = require('./debug.node');
} else {
  const moduleName = getPrebuiltModuleName("neon-prebuild-example", getTargetName());
  module.exports = require(moduleName);
}
