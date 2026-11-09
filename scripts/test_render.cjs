const { app, BrowserWindow } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[CONSOLE ${level}] ${message} (${sourceId}:${line})`);
  });

  win.webContents.on('render-process-gone', (event, details) => {
    console.log('[CRASH]', details);
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('[FAIL LOAD]', errorCode, errorDescription);
  });

  console.log('Loading file with hash /dashboard...');
  await win.loadFile(path.resolve('dist/index.html'), { hash: '/dashboard' });

  setTimeout(async () => {
    const html = await win.webContents.executeJavaScript('document.body.innerHTML');
    console.log('Body HTML length:', html.length);
    console.log('Body HTML snippet:', html.slice(0, 300));
    app.quit();
  }, 2000);
});

