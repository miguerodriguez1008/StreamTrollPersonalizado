const { spawn } = require('child_process');
const electron = require('electron');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electron, ['.'], {
  cwd: 'C:/Troll you',
  env,
  stdio: 'inherit'
});

child.on('error', (err) => console.error('Failed to start:', err));
child.on('exit', (code, signal) => console.log('Process exited with:', code, signal));
