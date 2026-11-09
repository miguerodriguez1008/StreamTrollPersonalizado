const { spawnSync } = require('child_process');
const electron = require('electron');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const res = spawnSync(electron, ['C:/Troll you/scripts/test_render.cjs'], {
  env,
  encoding: 'utf8'
});

console.log('STDOUT:\n', res.stdout);
console.log('STDERR:\n', res.stderr);
console.log('STATUS:', res.status);

