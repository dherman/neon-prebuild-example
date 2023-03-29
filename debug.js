const fs = require('fs');
const path = require('path');

module.exports = function loadDebug(dirname) {
  return fs.existsSync(path.join(dirname, "debug.node"))
    // FIXME: this might be the wrong module specifier syntax, test this
    ? require(`${dirname}/debug.node`)
    : null;
};
