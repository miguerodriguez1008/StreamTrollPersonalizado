const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');

async function repack() {
  const asarPath = path.resolve('dist_electron/win-unpacked/resources/app.asar');
  const tempExtractDir = path.resolve('.temp_asar_unpack');

  console.log('1. Extracting existing app.asar to:', tempExtractDir);
  if (fs.existsSync(tempExtractDir)) {
    fs.rmSync(tempExtractDir, { recursive: true, force: true });
  }
  asar.extractAll(asarPath, tempExtractDir);

  console.log('2. Copying updated dist/ into extracted folder...');
  function copyRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // Update dist
  copyRecursive(path.resolve('dist'), path.join(tempExtractDir, 'dist'));

  // Update electron
  copyRecursive(path.resolve('electron'), path.join(tempExtractDir, 'electron'));

  // Update package.json
  fs.copyFileSync(path.resolve('package.json'), path.join(tempExtractDir, 'package.json'));

  // Copy regalos.json if needed
  if (fs.existsSync(path.resolve('src/regalos.json'))) {
    const srcDir = path.join(tempExtractDir, 'src');
    if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
    fs.copyFileSync(path.resolve('src/regalos.json'), path.join(srcDir, 'regalos.json'));
  }

  console.log('3. Repacking app.asar...');
  await asar.createPackage(tempExtractDir, asarPath);
  console.log('✅ Repacked app.asar successfully at:', asarPath);

  // Clean up temp
  fs.rmSync(tempExtractDir, { recursive: true, force: true });

  // 4. Update installed app.asar if installed in LOCALAPPDATA
  const localInstalled = path.join(process.env.LOCALAPPDATA, 'Programs/troll-you/resources/app.asar');
  try {
    if (fs.existsSync(path.dirname(localInstalled))) {
      fs.copyFileSync(asarPath, localInstalled);
      console.log('✅ Updated installed app at:', localInstalled);
    }
  } catch (err) {
    console.warn('Could not copy directly to installed app (might be running):', err.message);
  }
}

repack().catch((err) => {
  console.error('Error during repack:', err);
  process.exit(1);
});

