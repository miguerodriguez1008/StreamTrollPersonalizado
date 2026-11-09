const fs = require('fs');

const code = fs.readFileSync('dist/assets/index-VOK9-C51.js', 'utf8');
const lines = code.split('\n');
console.log('Total lines:', lines.length);
if (lines[24]) {
  console.log('Line 25 snippet:', lines[24].slice(0, 500));
}

// Find occurrences of Ut
const matches = [...code.matchAll(/([a-zA-Z0-9_$]+)\s*=\s*Ut/g)];
console.log('Ut references:', matches.map(m => m[0]).slice(0, 10));

// Let's find where Ut is defined
const defs = [...code.matchAll(/(var|let|const|function)\s+Ut\b/g)];
console.log('Ut defs:', defs.map(d => d[0]));

