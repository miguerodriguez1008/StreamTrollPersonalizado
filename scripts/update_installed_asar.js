const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../dist_electron/win-unpacked/resources/app.asar');
const dest = path.join(process.env.LOCALAPPDATA, 'Programs/troll-you/resources/app.asar');

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('✅ Archivo app.asar instalado actualizado exitosamente en:', dest);
  } else {
    console.error('❌ No se encontró', src);
  }
} catch (e) {
  if (e.code === 'EPERM' || e.code === 'EBUSY') {
    console.log('⚠️ StreamTroll está abierto en este momento. Ciérralo y vuelve a ejecutar este comando para reemplazar el asar.');
  } else {
    console.error(e);
  }
}

