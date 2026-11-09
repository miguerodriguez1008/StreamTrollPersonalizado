const fs = require('fs');

const code = fs.readFileSync('dist/assets/index-VOK9-C51.js', 'utf8');

// Find all occurrences of Ut with surrounding 200 characters
let idx = 0;
let count = 0;
while ((idx = code.indexOf('Ut', idx)) !== -1 && count < 15) {
  const start = Math.max(0, idx - 80);
  const end = Math.min(code.length, idx + 80);
  console.log(`\n--- Match ${count + 1} at ${idx} ---`);
  console.log(code.slice(start, end));
  idx += 2;
  count++;
}

