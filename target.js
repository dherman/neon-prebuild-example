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

module.exports = getTargetName;
