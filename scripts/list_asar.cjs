const asar = require('@electron/asar');
const path = require('path');

const asarPath = path.resolve('dist_electron/win-unpacked/resources/app.asar');
try {
  const list = asar.listPackage(asarPath);
  console.log('Total files in app.asar:', list.length);
  console.log('dist files:', list.filter(f => f.includes('dist')));
  console.log('electron files:', list.filter(f => f.includes('electron')));
} catch (e) {
  console.error(e);
}

