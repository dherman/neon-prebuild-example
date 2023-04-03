const readline = require('readline');

process.stdin.resume();
process.stdin.setEncoding('utf-8');
const rl = readline.createInterface({
  input: process.stdin,
  terminal: false
});
rl.on('line', line => {
  try {
    const data = JSON.parse(line.trim());
    if (data.reason === 'compiler-artifact' && data.target.name === 'neon-prebuild-example') {
      console.log(data);
      rl.close();
      process.stdin.unref();
      process.exit(0);
    }
  } catch (ignoreme) {
    console.error(ignoreme.stack);
  }
});
