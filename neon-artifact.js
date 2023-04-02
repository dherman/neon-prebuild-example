#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const toString = require('stream-to-string');

// FIXME: more opts:
// - --crate-name <crate>
// - --package <package>
// - --crate-type <type>
function parseArgs() {
  const [ _node, _script, ...args ] = process.argv;

  let relative = false;
  let outfile = null;
  let crateName = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-r" || args[i] === "--relative") {
      relative = true;
      continue;
    }

    if (outfile) {
      throw new Error("too many arguments");
    }

    outfile = args[i];
  }

  if (!outfile) {
    throw new Error("no output file provided");
  }

  if (!crateName) {
    crateName = require(path.join(process.cwd(), "package.json")).name;
  }

  return { relative, outfile, crateName };
}

function usage() {
  console.error("usage: neon-artifact [options] <outfile>");
  console.error("  -r|--relative   interpret artifact path relative to manifest");
  console.error("  <outfile>       output file to copy artifact to");
}

function die(msg) {
  usage();
  console.error();
  console.error(msg);
  process.exit(1);
}

function processCargoMetadata(metadata, opts) {
  const sub = metadata.find(event => {
    return (event.reason === 'compiler-artifact') &&
      (event.target.name === opts.crateName);
  });

  if (!sub) {
    die(`no artifact created for ${opts.crateName}`);
  }

  const index = sub.target.crate_types.indexOf('cdylib');
  if (index < 0) {
    die(`no library artifact found for ${opts.crateName}`);
  }

  const abs = sub.filenames[index];

  console.error(`manifest_path=${sub.manifest_path}`);
  console.error(`dirname(manifest_path)=${path.dirname(sub.manifest_path)}`);
  console.error(`abs=${abs}`);

  const filename = opts.relative
    ? path.relative(path.dirname(sub.manifest_path), abs)
    : abs;


  // FIXME: needs all the logic of cargo-cp-artifact (timestamp check, M1 workaround, async, errors)
  fs.copyFileSync(filename, opts.outfile);
}

try {
  const opts = parseArgs();
  toString(process.stdin, (err, data) => {
    if (err) {
      die(err.message);
    }

    const metadata = data.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line)
      .map(line => JSON.parse(line));

    processCargoMetadata(metadata, opts);
  });
} catch (e) {
  die(e.message);
}
