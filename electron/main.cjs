const path = require('path');
const electron = require('electron');

// Safeguard against ELECTRON_RUN_AS_NODE environment variable
if (typeof electron === 'string' || !electron.app) {
  const { spawn } = require('child_process');
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  const child = spawn(process.execPath, process.argv.slice(1), {
    env,
    detached: true,
    stdio: 'ignore'
  });
  child.unref();
  process.exit(0);
}

const { app, BrowserWindow, ipcMain, screen } = electron;
const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');

// =========================================================================
// HIGH-PERFORMANCE GAMING & ZERO-LAG SWITCHES (144+ FPS OPTIMIZED)
// =========================================================================
// 1. Prevent Windows & Chromium from throttling background timers when game is active
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-renderer-backgrounding');

// 2. Hardware acceleration & high efficiency rasterization (low CPU/GPU overhead)
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('enable-accelerated-video-decode');
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');
app.commandLine.appendSwitch('disable-gpu-vsync'); // Prevents Electron vsync locks from stuttering game refresh rates
app.commandLine.appendSwitch('renderer-process-limit', '4');
app.commandLine.appendSwitch('disable-breakpad');

// Set normal process priority so Windows scheduler gives 100% core priority to active games
try {
  const os = require('os');
  if (os.setPriority) {
    os.setPriority(os.constants.priority.PRIORITY_NORMAL);
  }
} catch {}

const isDev = process.env.NODE_ENV === 'development';
let mainWindow = null;
let desktopOverlayWindow = null;
let desktopOverlayEnabled = true;
let hideDesktopOverlayTimeout = null;
let loginWindow = null;
let tiktokConnection = null;
let tikfinitySocket = null;

// Official TikTok Gift IDs Lookup (ensures exact Gift Name & Coin value even if a client/bridge only sends giftId)
const OFFICIAL_TIKTOK_GIFTS_BY_ID = {
  '5655': { name: 'Rose', coins: 1 },
  '5269': { name: 'TikTok', coins: 1 },
  '6064': { name: 'GG', coins: 1 },
  '5827': { name: 'Ice Cream Cone', coins: 1 },
  '7934': { name: 'Heart Me', coins: 1 },
  '5487': { name: 'Finger Heart', coins: 5 },
  '5900': { name: 'Rosa', coins: 10 },
  'gift_32': { name: 'Rosa', coins: 10 },
  '5879': { name: 'Doughnut', coins: 30 },
  '5658': { name: 'Perfume', coins: 20 },
  '5659': { name: 'Paper Crane', coins: 99 },
  '5660': { name: 'Hand Heart', coins: 100 },
  '6104': { name: 'Cap', coins: 99 },
  '5585': { name: 'Confetti', coins: 100 },
  '5652': { name: 'Panda', coins: 199 },
  '5650': { name: 'Money Gun', coins: 500 },
  '5509': { name: 'Sports Car', coins: 7000 },
  '6427': { name: 'Lion', coins: 29999 },
  '5566': { name: 'Universe', coins: 34999 }
};

function cleanGiftDescribe(desc) {
  if (!desc || typeof desc !== 'string') return '';
  return desc
    .replace(/^(sent|envi[oó]|enviaste|mand[oó]|send)\s+(a|an|un|una|el|la)?\s*/i, '')
    .replace(/[!?.]+$/, '')
    .trim();
}

function normalizeTikTokGiftEvent(data) {
  if (!data || typeof data !== 'object') return null;

  const rawGiftObj = (data.gift && typeof data.gift === 'object') ? data.gift : {};
  const giftDetails = (data.giftDetails && typeof data.giftDetails === 'object') ? data.giftDetails : {};
  const extGift = (data.extendedGiftInfo && typeof data.extendedGiftInfo === 'object') ? data.extendedGiftInfo : {};
  const userObj = (data.user && typeof data.user === 'object') ? data.user : {};

  const rawId =
    data.giftId ??
    rawGiftObj.id ??
    rawGiftObj.gift_id ??
    giftDetails.giftId ??
    extGift.id ??
    data.gift_id ??
    null;

  const giftId = rawId !== null && rawId !== undefined ? String(rawId) : null;
  const knownById = giftId && OFFICIAL_TIKTOK_GIFTS_BY_ID[giftId] ? OFFICIAL_TIKTOK_GIFTS_BY_ID[giftId] : null;

  const rawDiamonds =
    rawGiftObj.diamondCount ??
    data.diamondCount ??
    data.coins ??
    giftDetails.diamondCount ??
    extGift.diamond_count ??
    knownById?.coins ??
    1;

  const rawName =
    rawGiftObj.name ||
    data.giftName ||
    data.gift_name ||
    giftDetails.giftName ||
    extGift.name ||
    cleanGiftDescribe(rawGiftObj.describe || data.describe || giftDetails.describe) ||
    knownById?.name ||
    (Number(rawDiamonds) === 10 ? 'Rosa' : 'Rose');

  const repeatCount = Number(data.repeatCount ?? data.repeat_count ?? rawGiftObj.repeat_count ?? 1) || 1;
  const isComboGift = Boolean(rawGiftObj.combo || giftDetails.giftType === 1 || data.giftType === 1 || data.combo);
  const repeatEnd =
    typeof data.repeatEnd === 'boolean'
      ? data.repeatEnd
      : (data.repeatEnd === 1 || data.repeat_end === 1 || !isComboGift || repeatCount <= 1);

  const user =
    userObj.uniqueId ||
    userObj.nickname ||
    userObj.displayId ||
    data.uniqueId ||
    data.nickname ||
    data.username ||
    data.user ||
    'Espectador';

  const giftPictureUrl =
    data.giftPictureUrl ||
    data.contentImage ||
    rawGiftObj.image?.url?.[0] ||
    rawGiftObj.image?.urlList?.[0] ||
    rawGiftObj.image?.url_list?.[0] ||
    rawGiftObj.icon?.url?.[0] ||
    rawGiftObj.icon?.urlList?.[0] ||
    rawGiftObj.icon?.url_list?.[0] ||
    giftDetails.giftImage?.url?.[0] ||
    extGift.image?.url_list?.[0] ||
    extGift.icon?.url_list?.[0] ||
    null;

  return {
    user: String(user),
    giftId,
    giftName: String(rawName),
    giftPictureUrl,
    diamondCount: Number(rawDiamonds) || 1,
    repeatCount,
    repeatEnd,
    giftType: Number(rawGiftObj.type ?? giftDetails.giftType ?? data.giftType ?? 0),
    groupId: data.groupId || null,
    timestamp: Date.now()
  };
}

function forwardIncomingBridgeMessage(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'object') return { handled: false };

  const eventName = String(rawPayload.event || rawPayload.type || rawPayload.eventType || '').toLowerCase();
  const data = (rawPayload.data && typeof rawPayload.data === 'object') ? rawPayload.data : rawPayload;

  // Direct shader trigger from TikFinity Webhook (e.g. ?effect=drunk&duration=6)
  if (data.effect && !data.giftName && !data.gift && !data.giftId) {
    const durationMs = (Number(data.duration) || 6) * 1000;
    broadcastToOverlay({
      type: 'SHADER',
      effect: String(data.effect).toLowerCase(),
      duration: durationMs
    });
    return { handled: true, mode: 'shader' };
  }

  // Gift trigger (from TikFinity WebSocket or Webhook)
  if (
    eventName === 'gift' ||
    data.giftName ||
    data.gift_name ||
    data.giftId ||
    data.gift_id ||
    (data.gift && typeof data.gift === 'string')
  ) {
    const normalized = normalizeTikTokGiftEvent({
      ...data,
      giftName: data.giftName || data.gift_name || (typeof data.gift === 'string' ? data.gift : undefined)
    });
    if (normalized && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('tiktok:gift', normalized);
    }
    return { handled: true, mode: 'gift', gift: normalized };
  }

  // Follow / Share / Like / Subscribe / Chat events from TikFinity
  if (['follow', 'share', 'like', 'likes', 'subscribe', 'sub', 'chat', 'member', 'social'].includes(eventName)) {
    const userObj = (data.user && typeof data.user === 'object') ? data.user : {};
    const user =
      userObj.uniqueId ||
      userObj.nickname ||
      data.uniqueId ||
      data.nickname ||
      data.username ||
      (typeof data.user === 'string' ? data.user : '') ||
      'Espectador';

    const mappedType =
      eventName === 'member' ? 'follow' :
      eventName === 'social' ? 'share' :
      eventName === 'like' ? 'likes' :
      eventName === 'subscribe' ? 'sub' :
      eventName;

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('tiktok:event', {
        eventType: mappedType,
        user: String(user),
        comment: data.comment || data.message || '',
        likeCount: Number(data.likeCount || data.likes || 100),
        timestamp: Date.now()
      });
    }
    return { handled: true, mode: 'event', eventType: mappedType };
  }

  return { handled: false };
}

function getConfigFilePath() {
  try {
    return path.join(app.getPath('userData'), 'stream_troll_config.json');
  } catch {
    return path.join(__dirname, 'stream_troll_config.json');
  }
}

function loadPersistentConfig() {
  try {
    const file = getConfigFilePath();
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading persistent config from disk:', err);
  }
  return null;
}

function savePersistentConfig(data) {
  try {
    const file = getConfigFilePath();
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const existing = loadPersistentConfig() || {};
    const merged = { ...existing, ...data, updatedAt: Date.now() };
    fs.writeFileSync(file, JSON.stringify(merged, null, 2), 'utf8');
    console.log('[CONFIG] Successfully saved config to disk:', file);
    return merged;
  } catch (err) {
    console.error('Error writing persistent config to disk:', err);
    return null;
  }
}

// Start local HTTP server for OBS Studio Browser Source & Real-Time Event Bridge
const OBS_PORT = 18923;
let obsServer = null;
let wsServer = null;
const sseClients = new Set();
const initialPersistentConfig = loadPersistentConfig() || {};
let lastEngineConfig = {
  type: 'ENGINE_CONFIG',
  graphicsEngine: true,
  alignmentGrid: false,
  giftMappings: initialPersistentConfig.giftMappings || null,
  sliderConfig: initialPersistentConfig.sliderConfig || null,
  timerConfig: initialPersistentConfig.timerConfig || null
};

function executeSystemTrollAction(action) {
  try {
    const act = String(action || '').toLowerCase().trim();
    console.log(`[STREAM TROLL ACTION] Executing system effect: ${act}`);
    if (act === 'close_app') {
      // Closes active foreground game window via Alt+F4
      exec('powershell -NoProfile -WindowStyle Hidden -Command "$w = New-Object -ComObject WScript.Shell; $w.SendKeys(\'%{F4}\')"');
    } else if (act === 'minimize_game' || act === 'show_desktop') {
      // Minimizes all open game windows revealing the Windows Desktop
      exec('powershell -NoProfile -WindowStyle Hidden -Command "(New-Object -ComObject Shell.Application).MinimizeAll()"');
    } else if (act === 'alt_tab') {
      // Switches active window taking streamer out of game
      exec('powershell -NoProfile -WindowStyle Hidden -Command "$w = New-Object -ComObject WScript.Shell; $w.SendKeys(\'%{TAB}\')"');
    } else if (act === 'close_tiktok_studio' || act === 'stop_stream_tiktok' || act === 'close_tiktok') {
      // Closes TikTok LIVE Studio completely and cuts the live broadcast
      console.log('[STREAM TROLL ACTION] Shutting down and closing TikTok LIVE Studio completely');
      exec('powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Milliseconds 600; Get-Process | Where-Object { $_.ProcessName -like \'*TikTok*Studio*\' -or $_.ProcessName -like \'*TikTok LIVE*\' } | Stop-Process -Force -ErrorAction SilentlyContinue; taskkill /F /T /IM \'TikTok LIVE Studio.exe\' /IM \'TikTok LIVE Studio Launcher.exe\' 2>$null"');
    } else if (act === 'stop_stream' || act === 'close_obs') {
      // Closes OBS Studio completely and cuts the broadcast
      console.log('[STREAM TROLL ACTION] Shutting down and closing OBS Studio completely');
      exec('powershell -NoProfile -WindowStyle Hidden -Command "$w = New-Object -ComObject WScript.Shell; $w.SendKeys(\'^{F12}\'); Start-Sleep -Milliseconds 600; Stop-Process -Name \'obs64\', \'obs32\', \'obs\', \'TikTok LIVE Studio\' -Force -ErrorAction SilentlyContinue"');
    }
  } catch (err) {
    console.error('[STREAM TROLL ACTION ERROR]:', err);
  }
}

function broadcastToOverlay(payload) {
  if (!payload || typeof payload !== 'object') return;
  if (payload.type === 'ENGINE_CONFIG') {
    lastEngineConfig = { ...lastEngineConfig, ...payload };
  }

  // Intercept system troll actions (close_app, minimize_game, alt_tab, stop_stream)
  if (payload.type === 'SHADER' || payload.type === 'ACTION') {
    const eff = String(payload.effect || payload.action || '').toLowerCase();
    if (eff === 'close_app' || eff === 'minimize_game' || eff === 'show_desktop' || eff === 'alt_tab' || eff === 'stop_stream' || eff === 'close_tiktok_studio' || eff === 'stop_stream_tiktok' || eff === 'close_tiktok') {
      executeSystemTrollAction(eff);
    }
  }

  // ULTRA-LOW LATENCY & ZERO-LAG ON-DEMAND OVERLAY:
  // Transparent windows force Windows DWM to re-composite every frame, dropping game FPS.
  // We keep the desktop overlay HIDDEN by default, waking it up only during active effects.
  if (desktopOverlayEnabled && desktopOverlayWindow && !desktopOverlayWindow.isDestroyed()) {
    if (payload.type === 'SHADER' || payload.type === 'ACTION' || payload.type === 'ALERT' || payload.type === 'GIFT_GRAPHIC') {
      if (hideDesktopOverlayTimeout) {
        clearTimeout(hideDesktopOverlayTimeout);
        hideDesktopOverlayTimeout = null;
      }
      try {
        const primary = screen.getPrimaryDisplay();
        if (primary && primary.bounds) {
          desktopOverlayWindow.setBounds(primary.bounds);
        }
        if (!desktopOverlayWindow.isVisible()) {
          desktopOverlayWindow.showInactive();
        }
      } catch {}
      const durationMs = Number(payload.duration) || 6000;
      hideDesktopOverlayTimeout = setTimeout(() => {
        try {
          if (desktopOverlayEnabled && desktopOverlayWindow && !desktopOverlayWindow.isDestroyed()) {
            desktopOverlayWindow.hide();
          }
        } catch {}
      }, durationMs + 600);
    }
  }

  const message = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }

  if (wsServer && wsServer.clients) {
    const wsMsg = JSON.stringify(payload);
    for (const client of wsServer.clients) {
      if (client.readyState === 1) { // 1 = OPEN
        try { client.send(wsMsg); } catch {}
      }
    }
  }

  if (desktopOverlayEnabled && desktopOverlayWindow && !desktopOverlayWindow.isDestroyed()) {
    try {
      desktopOverlayWindow.webContents.send('overlay:event', {
        ...payload,
        hasObsClients: sseClients.size > 0
      });
    } catch {}
  }
}

function startObsServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
  };

  obsServer = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Request-Private-Network');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const safeUrl = (req.url || '/').split('?')[0];

    // Real-time Server-Sent Events (SSE) stream for OBS Studio Browser Source
    if (req.method === 'GET' && safeUrl === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });

      res.write(`data: ${JSON.stringify(lastEngineConfig)}\n\n`);
      sseClients.add(res);

      const keepAlive = setInterval(() => {
        try {
          res.write(': ping\n\n');
        } catch (e) {
          clearInterval(keepAlive);
          sseClients.delete(res);
        }
      }, 15000);

      req.on('close', () => {
        clearInterval(keepAlive);
        sseClients.delete(res);
      });
      return;
    }

    // HTTP POST endpoint so Web/Browser Dashboard can also dispatch to OBS
    if (req.method === 'POST' && safeUrl === '/dispatch') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          broadcastToOverlay(payload);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, clients: sseClients.size }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
        }
      });
      return;
    }

    // Persistent Config Endpoint (guarantees mappings stay saved forever)
    if (safeUrl === '/api/config') {
      if (req.method === 'GET') {
        const cfg = loadPersistentConfig();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cfg || {}));
        return;
      }
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            const saved = savePersistentConfig(parsed);
            if (parsed.giftMappings) {
              broadcastToOverlay({ type: 'ENGINE_CONFIG', giftMappings: parsed.giftMappings });
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, config: saved }));
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
          }
        });
        return;
      }
    }

    // TikFinity / Streamer.bot / Webhook Endpoint (supports both GET query params and POST JSON)
    if (safeUrl === '/tikfinity' || safeUrl === '/webhook') {
      const fullUrl = new URL(req.url || '/', `http://127.0.0.1:${OBS_PORT}`);
      const queryObj = Object.fromEntries(fullUrl.searchParams.entries());

      if (req.method === 'GET') {
        const result = forwardIncomingBridgeMessage(queryObj);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, source: 'tikfinity-get', ...result }));
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const parsed = body ? JSON.parse(body) : {};
            const merged = { ...queryObj, ...parsed };
            const result = forwardIncomingBridgeMessage(merged);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, source: 'tikfinity-post', ...result }));
          } catch {
            const result = forwardIncomingBridgeMessage(queryObj);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, source: 'tikfinity-query', ...result }));
          }
        });
        return;
      }
    }

    const distPath = path.join(__dirname, '../dist');
    let filePath = path.join(distPath, safeUrl === '/' ? 'index.html' : safeUrl);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distPath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        const isAsset = safeUrl.startsWith('/assets/');
        res.writeHead(200, {
          'Content-Type': mimeTypes[ext] || 'application/octet-stream',
          'Cache-Control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache'
        });
        res.end(content);
      }
    });
  });

  obsServer.on('error', (err) => {
    console.error('OBS Server error:', err.message);
  });

  obsServer.listen(OBS_PORT, () => {
    console.log(`OBS Server ready on http://127.0.0.1:${OBS_PORT}/#/overlay`);
    console.log(`OBS Slider ready on http://127.0.0.1:${OBS_PORT}/#/slider`);
    console.log(`OBS Timer ready on http://127.0.0.1:${OBS_PORT}/#/timer`);

    try {
      const WebSocket = require('ws');
      wsServer = new WebSocket.Server({ server: obsServer });
      wsServer.on('connection', (socket) => {
        try {
          socket.send(JSON.stringify(lastEngineConfig));
        } catch {}
      });
      console.log(`StreamTroll WebSocket bridge listening on ws://127.0.0.1:${OBS_PORT}`);
    } catch (err) {
      console.warn('WebSocket server initialization note:', err.message);
    }
  });
}

function createDesktopOverlayWindow(targetDisplayId = null) {
  try {
    const displays = screen.getAllDisplays();
    const primary = screen.getPrimaryDisplay();
    const targetDisplay = (targetDisplayId && displays.find((d) => String(d.id) === String(targetDisplayId))) || primary;
    const bounds = targetDisplay.bounds;

    if (desktopOverlayEnabled && desktopOverlayWindow && !desktopOverlayWindow.isDestroyed()) {
      desktopOverlayWindow.setBounds(bounds);
      return;
    }

    desktopOverlayWindow = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      show: false,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: true,
      movable: false,
      focusable: false,
      hasShadow: false,
      fullscreenable: true,
      simpleFullscreen: true,
      backgroundColor: '#00000000',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        backgroundThrottling: false,
        zoomFactor: 1.0
      }
    });

    desktopOverlayWindow.setBounds(bounds);

    // Make the overlay 100% click-through so the user can play games normally without losing mouse/keyboard control
    desktopOverlayWindow.setIgnoreMouseEvents(true, { forward: true });
    desktopOverlayWindow.setAlwaysOnTop(true, 'screen-saver');
    desktopOverlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    if (isDev) {
      desktopOverlayWindow.loadURL('http://localhost:5173/#/overlay?desktop=true');
    } else {
      desktopOverlayWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
        hash: '/overlay?desktop=true'
      });
    }

    desktopOverlayWindow.on('closed', () => {
      desktopOverlayWindow = null;
    });
  } catch (err) {
    console.error('Error creating desktop overlay window:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: 'Stream Troll v1.2.0 - Stream Effects Manager',
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false
    },
    autoHideMenuBar: true
  });

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if ((input.control && input.key.toLowerCase() === 'r') || input.key === 'F5') {
      mainWindow.reload();
      event.preventDefault();
    }
  });

  if (isDev) {
    // In dev, load Vite's local dev server directly into dashboard
    mainWindow.loadURL('http://localhost:5173/#/dashboard');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html into dashboard
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: '/dashboard' });
  }

  mainWindow.once('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (desktopOverlayEnabled && desktopOverlayWindow && !desktopOverlayWindow.isDestroyed()) {
      try { desktopOverlayWindow.close(); } catch {}
    }
    if (loginWindow && !loginWindow.isDestroyed()) {
      try { loginWindow.close(); } catch {}
    }
  });
}

// Function to resolve TikTokLiveConnection class (prefers v2+ native TikTokLiveConnection so data.gift is not overwritten by legacy adapter)
function getWebcastPushConnectionClass() {
  try {
    const mainMod = require('tiktok-live-connector');
    if (mainMod && typeof mainMod.TikTokLiveConnection === 'function') {
      return mainMod.TikTokLiveConnection;
    }
    if (mainMod && typeof mainMod.WebcastPushConnection === 'function') {
      return mainMod.WebcastPushConnection;
    }
    if (typeof mainMod === 'function') {
      return mainMod;
    }
    if (mainMod && mainMod.default && typeof mainMod.default.TikTokLiveConnection === 'function') {
      return mainMod.default.TikTokLiveConnection;
    }
    if (mainMod && mainMod.default && typeof mainMod.default.WebcastPushConnection === 'function') {
      return mainMod.default.WebcastPushConnection;
    }
    if (mainMod && mainMod.default && typeof mainMod.default === 'function') {
      return mainMod.default;
    }
  } catch (e) {
    console.error('Error cargando tiktok-live-connector:', e);
  }

  try {
    const legacy = require('tiktok-live-connector/legacy');
    if (legacy && typeof legacy.WebcastPushConnection === 'function') {
      return legacy.WebcastPushConnection;
    }
  } catch (e) {}

  throw new Error('No se pudo encontrar la clase constructora TikTokLiveConnection en la librería tiktok-live-connector.');
}

// TikTok Live IPC Handlers
ipcMain.handle('tiktok:connect', async (event, username) => {
  try {
    // Intercept RouteConfig to ensure free community tier connection without Euler Business Plan errors
    try {
      const { RouteConfig } = require('tiktok-live-connector');
      if (RouteConfig) {
        RouteConfig.fetchRoomGifts = async () => [];
      }
    } catch (e) {}

    const TikTokConnectionClass = getWebcastPushConnectionClass();
    if (tiktokConnection) {
      try { tiktokConnection.disconnect(); } catch (e) {}
    }

    const cleanUser = username ? username.replace(/^@/, '').trim() : '';
    if (!cleanUser) {
      return { success: false, error: 'Por favor ingresa un nombre de usuario de TikTok.' };
    }

    tiktokConnection = new TikTokConnectionClass(cleanUser, {
      processInitialData: false,
      enableExtendedGiftInfo: false,
      requestPollingIntervalMs: 1000
    });

    const state = await tiktokConnection.connect();

    const extractUser = (data, fallback = 'Anónimo') => (
      data?.user?.uniqueId ||
      data?.user?.nickname ||
      data?.uniqueId ||
      data?.nickname ||
      fallback
    );

    tiktokConnection.on('gift', (data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:gift', normalizeTikTokGiftEvent(data));
      }
    });

    const sendFollow = (data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:event', {
          eventType: 'follow',
          user: extractUser(data, 'Nuevo Seguidor'),
          timestamp: Date.now()
        });
      }
    };
    tiktokConnection.on('follow', sendFollow);
    tiktokConnection.on('member', (data) => {
      // If actionId indicates follow or welcome, emit follow
      sendFollow(data);
    });

    const sendShare = (data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:event', {
          eventType: 'share',
          user: extractUser(data, 'Espectador'),
          timestamp: Date.now()
        });
      }
    };
    tiktokConnection.on('share', sendShare);
    tiktokConnection.on('social', sendShare);

    let likeAccumulator = 0;
    tiktokConnection.on('like', (data) => {
      likeAccumulator += Number(data.likeCount || data.count || 1);
      if (likeAccumulator >= 50) {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('tiktok:event', {
            eventType: 'likes',
            user: extractUser(data, 'Espectadores'),
            likeCount: likeAccumulator,
            timestamp: Date.now()
          });
        }
        likeAccumulator = 0;
      }
    });

    tiktokConnection.on('subscribe', (data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:event', {
          eventType: 'sub',
          user: extractUser(data, 'Suscriptor'),
          timestamp: Date.now()
        });
      }
    });

    tiktokConnection.on('chat', (data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:event', {
          eventType: 'chat',
          user: extractUser(data, 'Chat'),
          comment: data.comment || '',
          timestamp: Date.now()
        });
      }
    });

    tiktokConnection.on('disconnected', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:status', { connected: false, message: 'Desconectado de TikTok Live' });
      }
    });

    tiktokConnection.on('streamEnd', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:status', { connected: false, message: 'La transmisión en vivo de TikTok ha finalizado.' });
      }
    });

    tiktokConnection.on('error', (err) => {
      console.error('TikTok Live runtime error:', err);
    });

    return { success: true, roomId: state.roomId, username: cleanUser };
  } catch (error) {
    let msg = error.message || 'No se pudo conectar con el directo de TikTok. Verifica que el usuario esté en directo actualmente.';
    if (msg.includes('Failed to retrieve Room ID') || msg.includes('LIVE has ended') || msg.includes('User is offline') || msg.includes('not currently live') || msg.includes("isn't online")) {
      msg = `El usuario @${username ? username.replace(/^@/, '').trim() : ''} no está en directo en este momento o el usuario no existe. Asegúrate de que la transmisión esté activa en TikTok.`;
    }
    return { success: false, error: msg };
  }
});

ipcMain.handle('tiktok:disconnect', async () => {
  if (tiktokConnection) {
    try { tiktokConnection.disconnect(); } catch (e) {}
    tiktokConnection = null;
  }
  return { success: true };
});

// TikFinity WebSocket Bridge IPC Handlers
ipcMain.handle('tikfinity:connect', async (_event, customWsUrl) => {
  const wsUrl = (customWsUrl || 'ws://127.0.0.1:21213/').trim();
  try {
    let WSClass = global.WebSocket;
    try {
      const wsMod = require('ws');
      WSClass = wsMod.WebSocket || wsMod;
    } catch {}

    if (tikfinitySocket) {
      try { tikfinitySocket.close(); } catch {}
      tikfinitySocket = null;
    }

    return await new Promise((resolve) => {
      let settled = false;
      const socket = new WSClass(wsUrl);
      tikfinitySocket = socket;

      const timeout = setTimeout(() => {
        if (!settled) {
          settled = true;
          try { socket.close(); } catch {}
          resolve({
            success: false,
            error: `Tiempo de espera agotado al conectar con TikFinity (${wsUrl}). Asegúrate de tener TikFinity Desktop abierto o usa el Webhook HTTP.`
          });
        }
      }, 4500);

      const onOpen = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('tikfinity:status', { connected: true, url: wsUrl });
          }
          resolve({ success: true, url: wsUrl });
        }
      };

      const onMessage = (rawEvt) => {
        try {
          const text = typeof rawEvt === 'string'
            ? rawEvt
            : (rawEvt?.data ? String(rawEvt.data) : Buffer.isBuffer(rawEvt) ? rawEvt.toString('utf8') : String(rawEvt));
          const parsed = JSON.parse(text);
          forwardIncomingBridgeMessage(parsed);
        } catch (err) {
          console.error('TikFinity WS parse error:', err);
        }
      };

      const onClose = () => {
        if (tikfinitySocket === socket) {
          tikfinitySocket = null;
        }
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('tikfinity:status', { connected: false, url: wsUrl });
        }
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          resolve({
            success: false,
            error: `No se detectó TikFinity Desktop en ${wsUrl}. Abre la app de escritorio de TikFinity o usa el Webhook HTTP.`
          });
        }
      };

      const onError = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          try { socket.close(); } catch {}
          resolve({
            success: false,
            error: `No se pudo conectar al WebSocket de TikFinity (${wsUrl}). Verifica que TikFinity Desktop esté abierto.`
          });
        }
      };

      if (typeof socket.on === 'function') {
        socket.on('open', onOpen);
        socket.on('message', onMessage);
        socket.on('close', onClose);
        socket.on('error', onError);
      } else {
        socket.onopen = onOpen;
        socket.onmessage = onMessage;
        socket.onclose = onClose;
        socket.onerror = onError;
      }
    });
  } catch (err) {
    return { success: false, error: err.message || 'Error al conectar con TikFinity' };
  }
});

ipcMain.handle('tikfinity:disconnect', async () => {
  if (tikfinitySocket) {
    try { tikfinitySocket.close(); } catch {}
    tikfinitySocket = null;
  }
  return { success: true };
});

ipcMain.handle('tiktok:open-login', async () => {
  if (loginWindow && !loginWindow.isDestroyed()) {
    loginWindow.focus();
    return { success: true };
  }

  loginWindow = new BrowserWindow({
    width: 820,
    height: 760,
    minWidth: 500,
    minHeight: 600,
    title: 'Iniciar sesión | TikTok',
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: false
  });

  loginWindow.loadURL('https://www.tiktok.com/login');

  loginWindow.on('closed', () => {
    loginWindow = null;
  });

  return { success: true };
});

ipcMain.handle('system:get-screens', async () => {
  try {
    const displays = screen.getAllDisplays();
    const primaryId = screen.getPrimaryDisplay().id;
    return displays.map((d, index) => ({
      id: d.id,
      name: `Screen ${index + 1}`,
      resolution: `${d.bounds.width} x ${d.bounds.height}`,
      position: `Position: (${d.bounds.x}, ${d.bounds.y})`,
      isPrimary: d.id === primaryId
    }));
  } catch (err) {
    return [
      {
        id: 1,
        name: 'Screen 1',
        resolution: '1080 x 1920',
        position: 'Position: (0, 0)',
        isPrimary: true
      }
    ];
  }
});

ipcMain.handle('system:select-screen', async (_event, screenId) => {
  createDesktopOverlayWindow(screenId);
  return { success: true };
});

ipcMain.handle('system:toggle-desktop-overlay', async (_event, enabled) => {
  desktopOverlayEnabled = Boolean(enabled);
  if (!desktopOverlayEnabled && desktopOverlayWindow && !desktopOverlayWindow.isDestroyed()) {
    try { desktopOverlayWindow.hide(); } catch {}
  }
  return { success: true, enabled: desktopOverlayEnabled };
});

ipcMain.handle('system:execute-action', async (_event, payload) => {
  const action = payload?.action || payload;
  if (action) {
    executeSystemTrollAction(action);
  }
  return { success: true };
});

ipcMain.handle('config:get', async () => {
  return loadPersistentConfig();
});

ipcMain.handle('config:save', async (_event, data) => {
  const saved = savePersistentConfig(data);
  if (data?.giftMappings) {
    broadcastToOverlay({ type: 'ENGINE_CONFIG', giftMappings: data.giftMappings });
  }
  return { success: Boolean(saved), config: saved };
});

ipcMain.handle('overlay:dispatch', async (_event, payload) => {
  broadcastToOverlay(payload);
  return { success: true, clients: sseClients.size };
});

app.whenReady().then(() => {
  startObsServer();
  createWindow();
  createDesktopOverlayWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      createDesktopOverlayWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (obsServer) {
    try { obsServer.close(); } catch (e) {}
  }
  if (process.platform !== 'darwin') app.quit();
});
