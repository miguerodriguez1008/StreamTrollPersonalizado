const { spawn } = require('child_process');
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const p = spawn('C:/Users/MI PC/AppData/Local/Programs/troll-you/StreamTroll.exe', [], {
  env,
  stdio: 'inherit'
});

p.on('exit', (code, sig) => {
  console.log('StreamTroll exited:', code, sig);
});

