const { execSync } = require('child_process');

try {
  const out = execSync('tasklist', { encoding: 'utf8' });
  const lines = out.split('\n').filter(l => l.toLowerCase().includes('troll') || l.toLowerCase().includes('stream'));
  console.log('Matching processes in tasklist:\n', lines.join('\n'));
} catch (e) {
  console.error(e);
}

