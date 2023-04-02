#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const child = require('child_process');
const toString = require('stream-to-string');

// FIXME: more opts:
// - --crate-name <crate>
// - --package <package>
// - --crate-type <type>
function parseArgs() {
  const [ _node, _script, ...args ] = process.argv;

  let fromCross = false;
  let outfile = null;
  let crateName = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--from-cross") {
      fromCross = true;
      continue;
    }

    if (outfile) {
      throw new Error("too many arguments");
    }

    outfile = args[i];
  }

  if (!outfile) {
    outfile = "index.node";
  }

  if (!crateName) {
    crateName = require(path.join(process.cwd(), "package.json")).name;
  }

  return { fromCross, outfile, crateName };
}

function usage() {
  console.error("usage: neon-dist [options] [<outfile>]");
  console.error("  --from-cross  normalize paths from cross-rs output");
  console.error("  <outfile>     output file to copy artifact to (default: index.node)");
}

function die(msg) {
  usage();
  console.error();
  console.error(msg);
  process.exit(1);
}

function normalize(abs) {
  const result = child.spawnSync("cross", ["metadata", "--format-version=1", "--no-deps"]);
  const metadata = JSON.parse(result.stdout);
  console.error("metadata:");
  console.error(metadata);
  const rel = path.relative(metadata.workspace_root, abs);
  console.error(`absolute path: ${abs}`);
  console.error(`relativized path: ${rel}`);
  return rel;
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

  const filename = opts.fromCross ? normalize(abs) : abs;

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
