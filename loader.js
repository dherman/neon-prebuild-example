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
      throw new Error(`Neon: unsupported platform ${process.platform}`);
  }
}

exports.getTargetName = getTargetName;

function loadDebug(dirname) {
  return fs.existsSync(path.join(dirname, "debug.node"))
    // FIXME: this might be the wrong module specifier syntax, test this
    ? require(`${dirname}/debug.node`)
    : null;
}

exports.loadDebug = loadDebug;
