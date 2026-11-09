const { spawn } = require('child_process');
const electron = require('electron');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electron, ['C:/Troll you/scripts/test_render.cjs'], {
  env,
  stdio: 'inherit'
});

