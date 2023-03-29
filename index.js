const loadDebug = require('./debug');
const getTargetName = require('./target');

function loadRelease() {

  const targetName = getTargetName();

  // Expand the table of targets so that bundlers can statically
  // determine the complete set of dependencies.
  switch (targetName) {
    case 'win32-x64-msvc':
      return require('@neon-prebuild-example/win32-x64-msvc');
    case 'darwin-x64':
      return require('@neon-prebuild-example/darwin-x64');
    case 'linux-x64-gnu':
      return require('@neon-prebuild-example/linux-x64-gnu');
    case 'linux-x64-musl':
      return require('@neon-prebuild-example/linux-x64-musl');
    default:
      throw new Error(`unsupported platform: ${targetName}`);
  }
}

module.exports = loadDebug(__dirname) || loadRelease();
