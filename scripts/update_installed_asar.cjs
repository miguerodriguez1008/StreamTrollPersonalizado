const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  execSync('taskkill /F /IM StreamTroll.exe', { stdio: 'ignore' });
} catch {}

// Reset saved login session in AppData so it starts at Login Gate
try {
  const cfgPath = path.join(process.env.APPDATA, 'troll-you', 'stream_troll_config.json');
  if (fs.existsSync(cfgPath)) {
    const raw = fs.readFileSync(cfgPath, 'utf8');
    const cfg = JSON.parse(raw);
    cfg.trollUser = {
      isLoggedIn: false,
      email: '',
      username: '',
      plan: 'GRATUITO',
      avatar: '👤'
    };
    fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
    console.log('✅ stream_troll_config.json restablecido a modo Login.');
  }
} catch (err) {
  console.log('Nota sobre config:', err.message);
}

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

