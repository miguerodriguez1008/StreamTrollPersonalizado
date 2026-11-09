const { spawn } = require('child_process');
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const p = spawn('C:/Users/MI PC/AppData/Local/Programs/troll-you/StreamTroll.exe', [], {
  env,
  stdio: ['ignore', 'pipe', 'pipe']
});

p.stdout.on('data', (d) => console.log('STDOUT:', d.toString()));
p.stderr.on('data', (d) => console.log('STDERR:', d.toString()));

p.on('exit', (code, sig) => {
  console.log('EXIT:', code, sig);
  process.exit(0);
});

setTimeout(() => {
  console.log('STILL ALIVE! PID:', p.pid);
  process.exit(0);
}, 6000);

