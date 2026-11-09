const { spawn } = require('child_process');
const path = require('path');

const exe = 'C:/Troll you/dist_electron/win-unpacked/StreamTroll.exe';
const p = spawn(exe, [], { stdio: ['ignore', 'pipe', 'pipe'] });

p.stdout.on('data', (d) => console.log('STDOUT:', d.toString()));
p.stderr.on('data', (d) => console.log('STDERR:', d.toString()));

p.on('exit', (code, signal) => {
  console.log('EXIT:', code, signal);
  process.exit(0);
});

setTimeout(() => {
  console.log('Still running after 5s! PID:', p.pid);
  process.exit(0);
}, 5000);
