const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('c:/Troll you/src/Dashboard.jsx');
let content = fs.readFileSync(targetPath, 'utf8').replace(/\r\n/g, '\n');

console.log('Original length:', content.length);

// 1. Auth state initialization (starts on login screen on every fresh launch)
const oldAuthState = `  const [trollUser, setTrollUser] = useState(() => {
    try {
      const saved = localStorage.getItem('troll_me_user');
      return saved ? JSON.parse(saved) : {
        isLoggedIn: true,
        email: 'miguerodriguez1008@gmail.com',
        username: 'MigueRodriguez',
        plan: 'ULTIMATE',
        avatar: '😎'
      };
    } catch {
      return {
        isLoggedIn: true,
        email: 'miguerodriguez1008@gmail.com',
        username: 'MigueRodriguez',
        plan: 'ULTIMATE',
        avatar: '😎'
      };
    }
  });

  const [trollLoginEmail, setTrollLoginEmail] = useState('miguerodriguez1008@gmail.com');
  const [trollLoginPass, setTrollLoginPass] = useState('••••••••');`;

const newAuthState = `  // Troll Me / Stream Troll User Auth State (Starts on login screen on every app launch)
  const [trollUser, setTrollUser] = useState({
    isLoggedIn: false,
    email: '',
    username: '',
    plan: 'GRATUITO',
    avatar: '👤'
  });

  const [trollLoginEmail, setTrollLoginEmail] = useState('');
  const [trollLoginPass, setTrollLoginPass] = useState('');`;

if (content.includes(oldAuthState)) {
  content = content.replace(oldAuthState, newAuthState);
  console.log('✓ Replaced auth state');
} else {
  console.error('✗ Could not find oldAuthState');
}

// 2. Add Timer State right after sliderConfig
const oldSliderSection = `  const [showSliderSettings, setShowSliderSettings] = useState(true);

  const updateSliderConfig = useCallback((patch) => {`;

const newTimerStateSection = `  const [showSliderSettings, setShowSliderSettings] = useState(true);

  // Extensible Timer / Subathon State (Real-Time Coins-to-Seconds Engine)
  const [timerConfig, setTimerConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_timer_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      enabled: true,
      running: false,
      currentSeconds: 7200,        // 2 hours initial default
      initialSeconds: 7200,
      maxSeconds: 43200,           // 12 hours max cap (0 = unlimited)
      secondsPerCoin: 5,           // Core user requirement: 1 coin = 5 seconds
      addTimeFollow: 15,           // Seconds to add on Follow
      addTimeShare: 30,            // Seconds to add on Share
      addTimeSub: 300,             // Seconds to add on Sub (5 min)
      title: 'SUBATÓN TIKTOK LIVE',
      style: 'neon-cyber',
      soundOnAdd: true,
      lastAdded: null,
      specificGiftRules: [
        { id: 'tg-1', giftId: 'gift_2', giftName: 'Rose', coins: 1, seconds: 10 },
        { id: 'tg-2', giftId: 'gift_32', giftName: 'Rosa (x10)', coins: 10, seconds: 60 },
        { id: 'tg-3', giftId: '5879', giftName: 'Dona', coins: 30, seconds: 180 },
        { id: 'tg-4', giftId: '6427', giftName: 'León', coins: 29999, seconds: 7200 }
      ]
    };
  });
  const timerConfigRef = useRef(timerConfig);
  useEffect(() => {
    timerConfigRef.current = timerConfig;
  }, [timerConfig]);

  const [newTimerRuleGiftName, setNewTimerRuleGiftName] = useState('');
  const [newTimerRuleSeconds, setNewTimerRuleSeconds] = useState(60);

  // Timer Countdown interval (ticks every 1000ms when running)
  useEffect(() => {
    if (!timerConfig.running) return;
    const interval = setInterval(() => {
      setTimerConfig((prev) => {
        if (!prev.running || prev.currentSeconds <= 0) return prev;
        const nextSec = Math.max(0, prev.currentSeconds - 1);
        const nextCfg = { ...prev, currentSeconds: nextSec };
        try {
          channel.postMessage({ type: 'TIMER_SYNC', timerConfig: nextCfg });
        } catch {}
        return nextCfg;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerConfig.running]);

  const updateSliderConfig = useCallback((patch) => {`;

if (content.includes(oldSliderSection)) {
  content = content.replace(oldSliderSection, newTimerStateSection);
  console.log('✓ Added Timer state section');
} else {
  console.error('✗ Could not find oldSliderSection');
}

// 3. Login handlers update (Exclusive ULTIMATE for miguerodriguez1008@gmail.com)
const oldLoginHandlers = `  // Troll Me Auth Handlers
  const loginTrollMe = (e) => {
    if (e) e.preventDefault();
    const updated = {
      isLoggedIn: true,
      email: trollLoginEmail || 'miguerodriguez1008@gmail.com',
      username: (trollLoginEmail || 'Streamer').split('@')[0],
      plan: 'ULTIMATE',
      avatar: '😎'
    };
    setTrollUser(updated);
    localStorage.setItem('troll_me_user', JSON.stringify(updated));
    setShowTrollMeLoginModal(false);
    showToast(\`👑 ¡Sesión iniciada con éxito como \${updated.email}!\`);
  };

  const logoutTrollMe = () => {
    const updated = {
      isLoggedIn: false,
      email: '',
      username: '',
      plan: 'FREE',
      avatar: '👤'
    };
    setTrollUser(updated);
    localStorage.setItem('troll_me_user', JSON.stringify(updated));
    showToast('👋 Sesión cerrada en Stream Troll');
  };`;

const newLoginHandlers = `  // Troll Me Auth Handlers (Only miguerodriguez1008@gmail.com has ULTIMATE plan)
  const loginTrollMe = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanEmail = (trollLoginEmail || '').trim().toLowerCase();
    if (!cleanEmail) {
      showToast('⚠️ Ingresa un correo electrónico');
      return;
    }
    const isOwner = cleanEmail === 'miguerodriguez1008@gmail.com';
    const updated = {
      isLoggedIn: true,
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      plan: isOwner ? 'ULTIMATE' : 'GRATUITO',
      avatar: isOwner ? '👑' : '😎'
    };
    setTrollUser(updated);
    try {
      localStorage.setItem('troll_me_user', JSON.stringify(updated));
    } catch {}
    setShowTrollMeLoginModal(false);
    showToast(isOwner ? '👑 ¡Bienvenido Migue! Acceso ULTIMATE activado' : \`👋 ¡Bienvenido \${updated.username}! Plan Gratuito activo\`);
  };

  const logoutTrollMe = () => {
    const updated = {
      isLoggedIn: false,
      email: '',
      username: '',
      plan: 'GRATUITO',
      avatar: '👤'
    };
    setTrollUser(updated);
    try {
      localStorage.setItem('troll_me_user', JSON.stringify(updated));
    } catch {}
    showToast('👋 Sesión cerrada en Stream Troll');
  };`;

if (content.includes(oldLoginHandlers)) {
  content = content.replace(oldLoginHandlers, newLoginHandlers);
  console.log('✓ Updated login handlers');
} else {
  console.error('✗ Could not find oldLoginHandlers');
}

// 4. Persistence & Disk sync helper right above Mappings management
const oldMappingsMgmt = `  // Mappings management
  const saveGiftMappings = (updated) => {
    const data = updated || giftMappings;
    setGiftMappings([...data]);
    localStorage.setItem('stream_troll_mappings', JSON.stringify(data));
  };

  const saveEventMappings = (updated) => {
    const data = updated || eventMappings;
    setEventMappings([...data]);
    localStorage.setItem('stream_troll_event_mappings', JSON.stringify(data));
  };`;

const newPersistenceAndTimerHelpers = `  // Persistent Config Disk Writer (guarantees settings stay saved across app restarts)
  const persistConfigToDisk = useCallback((partialData) => {
    try {
      if (ipcRendererRef.current) {
        ipcRendererRef.current.invoke('config:save', partialData).catch(() => {});
      }
      fetch('http://127.0.0.1:18923/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialData)
      }).catch(() => {});
    } catch (e) {
      console.warn('Persist config error:', e);
    }
  }, []);

  // Boot Loader: Restores persistent mappings and timer config from disk on startup
  useEffect(() => {
    let isMounted = true;
    const loadFromDisk = async () => {
      try {
        let loaded = null;
        if (ipcRendererRef.current) {
          loaded = await ipcRendererRef.current.invoke('config:get').catch(() => null);
        }
        if (!loaded) {
          const res = await fetch('http://127.0.0.1:18923/api/config').catch(() => null);
          if (res && res.ok) {
            loaded = await res.json().catch(() => null);
          }
        }
        if (loaded && isMounted && typeof loaded === 'object') {
          if (Array.isArray(loaded.giftMappings) && loaded.giftMappings.length > 0) {
            setGiftMappings(loaded.giftMappings);
            try {
              localStorage.setItem('stream_troll_mappings', JSON.stringify(loaded.giftMappings));
              localStorage.setItem('stream_troll_gift_mappings', JSON.stringify(loaded.giftMappings));
            } catch {}
          }
          if (Array.isArray(loaded.eventMappings) && loaded.eventMappings.length > 0) {
            setEventMappings(loaded.eventMappings);
            try {
              localStorage.setItem('stream_troll_event_mappings', JSON.stringify(loaded.eventMappings));
            } catch {}
          }
          if (loaded.sliderConfig) {
            setSliderConfig((prev) => ({ ...prev, ...loaded.sliderConfig }));
          }
          if (loaded.timerConfig) {
            setTimerConfig((prev) => ({ ...prev, ...loaded.timerConfig }));
          }
        }
      } catch (e) {
        console.warn('Config load error:', e);
      }
    };
    loadFromDisk();
    return () => { isMounted = false; };
  }, []);

  // Extensible Timer / Subathon Engine & Helpers
  const formatTime = (totalSeconds) => {
    const s = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return \`\${String(hours).padStart(2, '0')}:\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
  };

  const saveTimerConfig = useCallback((newCfg) => {
    setTimerConfig((prev) => {
      const updated = { ...prev, ...newCfg };
      try {
        localStorage.setItem('stream_troll_timer_config', JSON.stringify(updated));
      } catch {}
      persistConfigToDisk({ timerConfig: updated });
      try {
        channel.postMessage({ type: 'TIMER_SYNC', timerConfig: updated });
      } catch {}
      dispatchToOverlay({ type: 'TIMER_SYNC', timerConfig: updated });
      return updated;
    });
  }, [persistConfigToDisk, dispatchToOverlay]);

  const toggleTimerRunning = useCallback(() => {
    setTimerConfig((prev) => {
      const nextState = !prev.running;
      const updated = { ...prev, running: nextState };
      try {
        localStorage.setItem('stream_troll_timer_config', JSON.stringify(updated));
      } catch {}
      persistConfigToDisk({ timerConfig: updated });
      try {
        channel.postMessage({ type: 'TIMER_SYNC', timerConfig: updated });
      } catch {}
      dispatchToOverlay({ type: 'TIMER_SYNC', timerConfig: updated });
      showToast(nextState ? '🟢 Extensible Timer reanudado y en cuenta regresiva' : '⏸️ Extensible Timer pausado');
      return updated;
    });
  }, [persistConfigToDisk, dispatchToOverlay, showToast]);

  const quickAdjustTime = useCallback((seconds) => {
    setTimerConfig((prev) => {
      const maxCap = prev.maxSeconds > 0 ? prev.maxSeconds : Infinity;
      const next = Math.max(0, Math.min(maxCap, prev.currentSeconds + seconds));
      const updated = { ...prev, currentSeconds: next };
      try {
        localStorage.setItem('stream_troll_timer_config', JSON.stringify(updated));
      } catch {}
      persistConfigToDisk({ timerConfig: updated });
      try {
        channel.postMessage({ type: 'TIMER_SYNC', timerConfig: updated });
      } catch {}
      dispatchToOverlay({ type: 'TIMER_SYNC', timerConfig: updated });
      showToast(seconds > 0 ? \`⏱️ +\${Math.round(seconds / 60)} min añadidos al Timer\` : \`⏱️ -\${Math.round(Math.abs(seconds) / 60)} min restados del Timer\`);
      return updated;
    });
  }, [persistConfigToDisk, dispatchToOverlay, showToast]);

  const resetTimerToInitial = useCallback(() => {
    setTimerConfig((prev) => {
      const resetVal = prev.initialSeconds || 7200;
      const updated = { ...prev, currentSeconds: resetVal, running: false };
      try {
        localStorage.setItem('stream_troll_timer_config', JSON.stringify(updated));
      } catch {}
      persistConfigToDisk({ timerConfig: updated });
      try {
        channel.postMessage({ type: 'TIMER_SYNC', timerConfig: updated });
      } catch {}
      dispatchToOverlay({ type: 'TIMER_SYNC', timerConfig: updated });
      showToast(\`🔄 Timer reiniciado a \${formatTime(resetVal)}\`);
      return updated;
    });
  }, [persistConfigToDisk, dispatchToOverlay, showToast]);

  const addSecondsToTimer = useCallback((secondsToAdd, reasonText) => {
    setTimerConfig((prev) => {
      if (!prev.enabled) return prev;
      const current = prev.currentSeconds;
      const maxCap = prev.maxSeconds > 0 ? prev.maxSeconds : Infinity;
      const nextSeconds = Math.min(maxCap, current + secondsToAdd);
      const diff = nextSeconds - current;
      if (diff <= 0) return prev;

      const payload = {
        ...prev,
        currentSeconds: nextSeconds,
        lastAdded: {
          seconds: diff,
          reason: reasonText || 'Donación',
          timestamp: Date.now()
        }
      };

      try {
        localStorage.setItem('stream_troll_timer_config', JSON.stringify(payload));
      } catch {}
      persistConfigToDisk({ timerConfig: payload });
      try {
        channel.postMessage({ type: 'TIMER_SYNC', timerConfig: payload });
      } catch {}
      dispatchToOverlay({ type: 'TIMER_SYNC', timerConfig: payload });

      return payload;
    });

    showToast(\`⏱️ +\${secondsToAdd}s añadidos al Timer (\${reasonText || 'Donación'})\`);
  }, [persistConfigToDisk, dispatchToOverlay, showToast]);

  const downloadTimerHtml = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const timerUrl = \`\${baseUrl}#/timer\`;
    const htmlContent = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>StreamTroll OBS Timer</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
    iframe { width: 100vw; height: 100vh; border: none; }
  </style>
</head>
<body>
  <iframe src="\${timerUrl}" allow="autoplay"></iframe>
</body>
</html>\`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'StreamTroll_OBS_Timer_Subaton.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 ¡Archivo de Timer descargado! Arrástralo adentro de OBS');
  };

  const openTimerPopout = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const timerUrl = \`\${baseUrl}#/timer\`;
    window.open(
      timerUrl,
      'StreamTrollTimerWindow',
      'width=550,height=220,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    );
    showToast('⏱️ Ventana Flotante del Timer abierta');
  };

  const addSpecificTimerRule = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTimerRuleGiftName.trim()) {
      showToast('⚠️ Escribe el nombre del regalo');
      return;
    }
    const rule = {
      id: \`tg-\${Date.now()}\`,
      giftName: newTimerRuleGiftName.trim(),
      seconds: Number(newTimerRuleSeconds) || 60,
      enabled: true
    };
    const updatedRules = [...(timerConfig.specificGiftRules || []), rule];
    saveTimerConfig({ specificGiftRules: updatedRules });
    setNewTimerRuleGiftName('');
    setNewTimerRuleSeconds(60);
    showToast(\`✅ Regla para "\${rule.giftName}" agregada (+\${rule.seconds}s)\`);
  };

  const removeSpecificTimerRule = (id) => {
    const updatedRules = (timerConfig.specificGiftRules || []).filter((r) => r.id !== id);
    saveTimerConfig({ specificGiftRules: updatedRules });
    showToast('🗑️ Regla de regalo eliminada');
  };

  // Mappings management
  const saveGiftMappings = (updated) => {
    const data = updated || giftMappings;
    setGiftMappings([...data]);
    try {
      localStorage.setItem('stream_troll_mappings', JSON.stringify(data));
    } catch {}
    persistConfigToDisk({ giftMappings: data });
  };

  const saveEventMappings = (updated) => {
    const data = updated || eventMappings;
    setEventMappings([...data]);
    try {
      localStorage.setItem('stream_troll_event_mappings', JSON.stringify(data));
    } catch {}
    persistConfigToDisk({ eventMappings: data });
  };`;

if (content.includes(oldMappingsMgmt)) {
  content = content.replace(oldMappingsMgmt, newPersistenceAndTimerHelpers);
  console.log('✓ Added persistence and Timer helper functions');
} else {
  console.error('✗ Could not find oldMappingsMgmt');
}

// 5. Hook Timer into dispatchGiftEffect
const oldDispatchEnd = `      if (!matched) {
        const comboLabel = finalRepeatCount > 1 ? \` x\${finalRepeatCount}\` : '';
        setActivityFeed((prev) => [
          {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            user,
            giftName: \`\${giftName}\${comboLabel}\`,
            coins: totalCoins,
            unmatched: true
          },
          ...prev.slice(0, 14)
        ]);
      }
    };`;

const newDispatchEnd = `      if (!matched) {
        const comboLabel = finalRepeatCount > 1 ? \` x\${finalRepeatCount}\` : '';
        setActivityFeed((prev) => [
          {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            user,
            giftName: \`\${giftName}\${comboLabel}\`,
            coins: totalCoins,
            unmatched: true
          },
          ...prev.slice(0, 14)
        ]);
      }

      // Extensible Timer Integration (Subathon - Coins to Seconds Engine)
      if (timerConfigRef.current?.enabled) {
        let addedSeconds = 0;
        let ruleLabel = '';

        // Check if there is a specific gift rule for this gift
        const specRule = timerConfigRef.current.specificGiftRules?.find((r) => {
          if (!r.enabled && r.enabled !== undefined) return false;
          if (r.giftId && (String(r.giftId) === String(giftId))) return true;
          return isGiftNameMatch(giftName, r.giftName, giftId, r.giftId);
        });

        if (specRule && Number(specRule.seconds) > 0) {
          addedSeconds = Number(specRule.seconds) * (finalRepeatCount || 1);
          ruleLabel = \`\${user}: \${giftName}\${finalRepeatCount > 1 ? \` x\${finalRepeatCount}\` : ''}\`;
        } else if (Number(totalCoins) > 0) {
          const secPerCoin = Number(timerConfigRef.current.secondsPerCoin) || 5;
          addedSeconds = Math.round(totalCoins * secPerCoin);
          ruleLabel = \`\${user}: \${totalCoins} 🪙 (\${giftName}\${finalRepeatCount > 1 ? \` x\${finalRepeatCount}\` : ''})\`;
        }

        if (addedSeconds > 0) {
          addSecondsToTimer(addedSeconds, ruleLabel);
        }
      }
    };`;

if (content.includes(oldDispatchEnd)) {
  content = content.replace(oldDispatchEnd, newDispatchEnd);
  console.log('✓ Hooked timer into dispatchGiftEffect');
} else {
  console.error('✗ Could not find oldDispatchEnd');
}

// 6. Hook Timer into handleIncomingEvent
const oldEventEnd = `    if (matched) {
      showToast(\`⚡ Evento \${eventType} activó un shader\`);
    }
  }, [eventMappings, sendEffect, showToast, dispatchToOverlay]);`;

const newEventEnd = `    if (matched) {
      showToast(\`⚡ Evento \${eventType} activó un shader\`);
    }

    // Extensible Timer Event addition (Follow, Share, Sub)
    if (timerConfigRef.current?.enabled) {
      if ((eventType === 'follow') && Number(timerConfigRef.current.addTimeFollow) > 0) {
        addSecondsToTimer(Number(timerConfigRef.current.addTimeFollow), \`\${user}: Follow (+ \${timerConfigRef.current.addTimeFollow}s)\`);
      } else if ((eventType === 'share' || eventType === 'social') && Number(timerConfigRef.current.addTimeShare) > 0) {
        addSecondsToTimer(Number(timerConfigRef.current.addTimeShare), \`\${user}: Compartir (+ \${timerConfigRef.current.addTimeShare}s)\`);
      } else if ((eventType === 'sub' || eventType === 'subscribe' || eventType === 'superfan') && Number(timerConfigRef.current.addTimeSub) > 0) {
        addSecondsToTimer(Number(timerConfigRef.current.addTimeSub), \`\${user}: Suscripción (+ \${timerConfigRef.current.addTimeSub}s)\`);
      }
    }
  }, [eventMappings, sendEffect, showToast, dispatchToOverlay, addSecondsToTimer]);`;

if (content.includes(oldEventEnd)) {
  content = content.replace(oldEventEnd, newEventEnd);
  console.log('✓ Hooked timer into handleIncomingEvent');
} else {
  console.error('✗ Could not find oldEventEnd');
}

// 7. Strict Auth Gate on Render
const oldRenderStart = `  return (
    <div className="app-container">`;

const newRenderStart = `  // Strict Gate check: If user has not logged in, render ONLY the full-screen Login Screen.
  // Nothing from the dashboard, sidebar, mappings, or controls is visible or rendered.
  if (!trollUser?.isLoggedIn) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(ellipse at 50% 20%, #0f1c3f 0%, #080c16 60%, #03060a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          boxSizing: 'border-box',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999999,
          overflow: 'hidden',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        {toastMessage && <div className="toast-success">{toastMessage}</div>}

        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, transparent 70%)', top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', filter: 'blur(50px)' }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
          <div className="troll-logo-retro" style={{ fontSize: '2.6rem', letterSpacing: '4px', textShadow: '0 0 25px rgba(6, 182, 212, 0.6), 0 0 50px rgba(236, 72, 153, 0.4)' }}>
            STREAM TROLL
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.5rem', fontWeight: 700, letterSpacing: '1px' }}>
            PORTAL DE ACCESO • STREAM EFFECTS MANAGER
          </p>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '2.5rem 2.25rem',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.2)',
            position: 'relative',
            zIndex: 2,
            boxSizing: 'border-box'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 0.4rem 0' }}>
              🔑 Iniciar Sesión
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
              Ingresa con tu correo electrónico para desbloquear el panel de control.
            </p>
          </div>

          <form onSubmit={loginTrollMe}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                className="input-field"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  background: '#090d16',
                  border: '1.5px solid #334155',
                  borderRadius: '12px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                placeholder="ejemplo@streamer.com"
                value={trollLoginEmail}
                onChange={(e) => setTrollLoginEmail(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                CONTRASEÑA
              </label>
              <input
                type="password"
                className="input-field"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  background: '#090d16',
                  border: '1.5px solid #334155',
                  borderRadius: '12px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                placeholder="••••••••"
                value={trollLoginPass}
                onChange={(e) => setTrollLoginPass(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.98rem',
                fontWeight: 800,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #06b6d4, #ec4899)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
              }}
            >
              🚀 Entrar al Panel
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              ¿Primera vez? Tu cuenta se crea automáticamente al ingresar.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">`;

if (content.includes(oldRenderStart)) {
  content = content.replace(oldRenderStart, newRenderStart);
  console.log('✓ Added Strict Auth Gate on Render');
} else {
  console.error('✗ Could not find oldRenderStart');
}

// 8. Replace Tab 7 (Extensible Timer placeholder) with full Subathon Station
const oldTimerTab = `        {/* =========================================================
            TAB 7: EXTENSIBLE TIMER
            ========================================================= */}
        {activeTab === 'timer' && (
          <div className="glass-panel">
            <h2>⏱️ Extensible Timer (Subatón / Cronómetro)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Aumenta automáticamente el tiempo de tu directo cada vez que tus espectadores envíen regalos.
            </p>
            <div className="feature-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#38bdf8', marginBottom: '1rem', fontFamily: 'monospace' }}>
                02:45:18
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-success" onClick={() => showToast('⏱️ Cronómetro iniciado')}>Iniciar</button>
                <button className="btn btn-secondary" onClick={() => showToast('⏱️ +5 minutos añadidos')}>+5 Minutos</button>
                <button className="btn btn-danger" onClick={() => showToast('⏱️ Cronómetro pausado')}>Pausar</button>
              </div>
            </div>
          </div>
        )}`;

const newTimerTab = `        {/* =========================================================
            TAB 7: EXTENSIBLE TIMER (SUBATÓN TIKTOK LIVE)
            ========================================================= */}
        {activeTab === 'timer' && (
          <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative' }}>
            {/* Header & Master Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⏱️</span> Extensible Timer (Subatón TikTok Live)
                  </h2>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    background: timerConfig.running ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                    color: timerConfig.running ? '#10b981' : '#eab308',
                    border: timerConfig.running ? '1px solid #10b981' : '1px solid #eab308'
                  }}>
                    {timerConfig.running ? '● EN VIVO (CONTANDO)' : '⏸️ PAUSADO'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: '0.4rem 0 0 0', fontSize: '0.9rem' }}>
                  Aumenta automáticamente el tiempo de tu transmisión en vivo por cada moneda o regalo donado por tu comunidad.
                </p>
              </div>

              {/* Master Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <input
                    type="checkbox"
                    checked={timerConfig.enabled}
                    onChange={(e) => saveTimerConfig({ enabled: e.target.checked })}
                    style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: timerConfig.enabled ? '#38bdf8' : '#94a3b8' }}>
                    {timerConfig.enabled ? 'Motor de Timer Activo' : 'Motor Desactivado'}
                  </span>
                </label>
              </div>
            </div>

            {/* BIG DIGITAL CLOCK DISPLAY (LED/Cyber Style) */}
            <div style={{
              background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.98) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '20px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(56, 189, 248, 0.1)',
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '3px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {timerConfig.title || 'SUBATÓN TIKTOK LIVE'}
              </div>

              {/* Digital Numbers */}
              <div style={{
                fontSize: '4.2rem',
                fontWeight: 900,
                color: timerConfig.currentSeconds < 300 ? '#f43f5e' : '#38bdf8',
                fontFamily: "'Courier New', Courier, monospace",
                letterSpacing: '4px',
                textShadow: timerConfig.currentSeconds < 300
                  ? '0 0 25px rgba(244, 63, 94, 0.8), 0 0 50px rgba(244, 63, 94, 0.4)'
                  : '0 0 25px rgba(56, 189, 248, 0.8), 0 0 50px rgba(56, 189, 248, 0.3)',
                margin: '0.5rem 0 1rem 0'
              }}>
                {formatTime(timerConfig.currentSeconds)}
              </div>

              {/* Info Badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#cbd5e1' }}>
                  ⏳ <strong>Tiempo Inicial:</strong> {formatTime(timerConfig.initialSeconds || 7200)}
                </span>
                <span style={{ color: '#cbd5e1' }}>
                  🛑 <strong>Límite Máximo:</strong> {timerConfig.maxSeconds > 0 ? formatTime(timerConfig.maxSeconds) : 'Sin Límite (∞)'}
                </span>
                <span style={{ color: '#cbd5e1' }}>
                  🪙 <strong>Conversión:</strong> 1 Moneda = +{timerConfig.secondsPerCoin || 5} seg
                </span>
              </div>

              {/* Master Control Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn"
                  style={{
                    padding: '0.75rem 1.8rem',
                    fontSize: '1rem',
                    fontWeight: 800,
                    borderRadius: '12px',
                    background: timerConfig.running ? 'linear-gradient(135deg, #eab308, #ca8a04)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    boxShadow: timerConfig.running ? '0 4px 15px rgba(234, 179, 8, 0.4)' : '0 4px 15px rgba(16, 185, 129, 0.4)',
                    cursor: 'pointer'
                  }}
                  onClick={toggleTimerRunning}
                >
                  {timerConfig.running ? '⏸️ Pausar Cuenta Regresiva' : '▶ Iniciar Cuenta Regresiva'}
                </button>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem' }} onClick={() => quickAdjustTime(60)}>+1m</button>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem' }} onClick={() => quickAdjustTime(300)}>+5m</button>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem' }} onClick={() => quickAdjustTime(900)}>+15m</button>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem' }} onClick={() => quickAdjustTime(1800)}>+30m</button>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem' }} onClick={() => quickAdjustTime(3600)}>+1h</button>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }} onClick={() => quickAdjustTime(-60)}>-1m</button>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }} onClick={() => quickAdjustTime(-300)}>-5m</button>
                </div>

                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ padding: '0.65rem 1rem', fontSize: '0.82rem' }}
                  onClick={resetTimerToInitial}
                  title="Reinicia el reloj al tiempo inicial configurado"
                >
                  🔄 Reiniciar
                </button>
              </div>
            </div>

            {/* GRID OF CONFIGURATION SECTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              
              {/* CARD 1: REGLA MAESTRA DE MONEDAS A TIEMPO (REQUERIMIENTO DEL USUARIO) */}
              <div className="feature-card" style={{ border: '1.5px solid rgba(234, 179, 8, 0.4)', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.04), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>🪙</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fde047' }}>Monedas a Segundos (Subatón)</h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>Suma tiempo automáticamente por cada moneda donada</p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                    Segundos que añade CADA MONEDA (🪙):
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="number"
                      min="1"
                      max="3600"
                      className="input-field"
                      style={{ fontSize: '1.1rem', fontWeight: 800, width: '120px', padding: '10px' }}
                      value={timerConfig.secondsPerCoin || 5}
                      onChange={(e) => saveTimerConfig({ secondsPerCoin: Math.max(1, Number(e.target.value) || 1) })}
                    />
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>segundos / moneda</span>
                  </div>
                </div>

                {/* Equivalencia en Vivo */}
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', marginBottom: '6px' }}>
                    📌 TABLA DE EQUIVALENCIAS EN VIVO:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                    <div>🌹 <strong>1 Rosa (1🪙):</strong> +{(timerConfig.secondsPerCoin || 5) * 1}s</div>
                    <div>🌹 <strong>Rosa x10 (10🪙):</strong> +{(timerConfig.secondsPerCoin || 5) * 10}s</div>
                    <div>🍩 <strong>Dona (30🪙):</strong> +{(timerConfig.secondsPerCoin || 5) * 30}s</div>
                    <div>🎁 <strong>100 Monedas:</strong> +{Math.floor((timerConfig.secondsPerCoin || 5) * 100 / 60)}m {(timerConfig.secondsPerCoin || 5) * 100 % 60}s</div>
                    <div>🦁 <strong>1,000 Monedas:</strong> +{Math.floor((timerConfig.secondsPerCoin || 5) * 1000 / 60)}m</div>
                    <div>👑 <strong>León (29,999🪙):</strong> +{Math.floor((timerConfig.secondsPerCoin || 5) * 29999 / 3600)} horas</div>
                  </div>
                </div>

                {/* Simuladores de prueba inmediata */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '7px 10px', fontSize: '0.78rem' }}
                    onClick={() => addSecondsToTimer(timerConfig.secondsPerCoin || 5, 'Prueba: 1 Moneda (Rosa 🌹)')}
                  >
                    Simular +1 Moneda
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '7px 10px', fontSize: '0.78rem' }}
                    onClick={() => addSecondsToTimer((timerConfig.secondsPerCoin || 5) * 10, 'Prueba: 10 Monedas (Rosa x10 🌹)')}
                  >
                    Simular +10 Monedas
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '7px 10px', fontSize: '0.78rem' }}
                    onClick={() => addSecondsToTimer((timerConfig.secondsPerCoin || 5) * 100, 'Prueba: 100 Monedas')}
                  >
                    Simular +100 🪙
                  </button>
                </div>
              </div>

              {/* CARD 2: TIEMPO INICIAL Y LÍMITES */}
              <div className="feature-card" style={{ border: '1.5px solid rgba(56, 189, 248, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>⚙️</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#38bdf8' }}>Límites y Parámetros</h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>Configura el inicio y el tope máximo de tu subatón</p>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px' }}>
                    Tiempo Inicial al Reiniciar (Minutos):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    className="input-field"
                    value={Math.round((timerConfig.initialSeconds || 7200) / 60)}
                    onChange={(e) => {
                      const mins = Math.max(1, Number(e.target.value) || 60);
                      saveTimerConfig({ initialSeconds: mins * 60 });
                    }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Por defecto: 120 minutos (2 horas).</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px' }}>
                    Tope Máximo de Tiempo (Límite):
                  </label>
                  <select
                    className="input-field"
                    value={timerConfig.maxSeconds || 0}
                    onChange={(e) => saveTimerConfig({ maxSeconds: Number(e.target.value) })}
                  >
                    <option value={0}>Sin Límite (Infinito ∞)</option>
                    <option value={14400}>4 Horas Máximo</option>
                    <option value={21600}>6 Horas Máximo</option>
                    <option value={28800}>8 Horas Máximo</option>
                    <option value={43200}>12 Horas Máximo</option>
                    <option value={86400}>24 Horas (Subatón 1 Día)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.84rem', color: '#cbd5e1' }}>
                    <input
                      type="checkbox"
                      checked={timerConfig.soundOnAdd !== false}
                      onChange={(e) => saveTimerConfig({ soundOnAdd: e.target.checked })}
                    />
                    <span>🔊 Reproducir Chime de Audio al sumar tiempo en OBS</span>
                  </label>
                </div>
              </div>

              {/* CARD 3: TIEMPO POR EVENTOS SOCIALES */}
              <div className="feature-card" style={{ border: '1.5px solid rgba(168, 85, 247, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>👥</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#c084fc' }}>Eventos Sociales</h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>Añade tiempo por follows, shares y suscriptores</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '2px' }}>
                      👤 Segundos por Follow:
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="input-field"
                      value={timerConfig.addTimeFollow || 0}
                      onChange={(e) => saveTimerConfig({ addTimeFollow: Number(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '2px' }}>
                      🔄 Segundos por Compartir (Share):
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="input-field"
                      value={timerConfig.addTimeShare || 0}
                      onChange={(e) => saveTimerConfig({ addTimeShare: Number(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '2px' }}>
                      ⭐ Segundos por Suscripción:
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="input-field"
                      value={timerConfig.addTimeSub || 0}
                      onChange={(e) => saveTimerConfig({ addTimeSub: Number(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: REGLAS ESPECÍFICAS POR REGALO (EXCEPCIONES) */}
            <div className="feature-card" style={{ border: '1.5px solid rgba(236, 72, 153, 0.35)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>🎁</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f472b6' }}>Reglas Fijas por Regalo (Excepciones)</h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                      Asigna segundos específicos a un regalo (anula el cálculo automático de monedas para ese regalo)
                    </p>
                  </div>
                </div>
              </div>

              {/* Form to add rule */}
              <form onSubmit={addSpecificTimerRule} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input
                  type="text"
                  className="input-field"
                  style={{ flex: 2, minWidth: '160px' }}
                  placeholder="Nombre de regalo (ej: León, Rosa, Dona)"
                  value={newTimerRuleGiftName}
                  onChange={(e) => setNewTimerRuleGiftName(e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '120px' }}>
                  <input
                    type="number"
                    min="1"
                    className="input-field"
                    style={{ width: '100%' }}
                    placeholder="Segundos"
                    value={newTimerRuleSeconds}
                    onChange={(e) => setNewTimerRuleSeconds(Number(e.target.value))}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>seg</span>
                </div>
                <button type="submit" className="btn btn-secondary" style={{ padding: '0 16px', fontWeight: 800 }}>
                  ➕ Agregar Regla
                </button>
              </form>

              {/* Rules List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                {(timerConfig.specificGiftRules || []).map((rule) => (
                  <div key={rule.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px' }}>
                    <div>
                      <strong style={{ color: '#f8fafc', fontSize: '0.88rem' }}>{rule.giftName}</strong>
                      <div style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700 }}>
                        +{rule.seconds}s ({Math.floor(rule.seconds / 60)}m {rule.seconds % 60}s)
                      </div>
                    </div>
                    <button
                      type="button"
                      style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1rem', padding: '4px' }}
                      onClick={() => removeSpecificTimerRule(rule.id)}
                      title="Eliminar regla fija"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 5: OBS STUDIO INTEGRATION CARD */}
            <div className="feature-card" style={{ border: '2px solid rgba(16, 185, 129, 0.5)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>📺</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#34d399' }}>Integración con OBS Studio (Browser Source)</h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                    Agrega el reloj digital transparente en tu directo de OBS Studio o TikTok Live Studio
                  </p>
                </div>
              </div>

              {/* URL Box */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  readOnly
                  className="input-field"
                  style={{ flex: 1, minWidth: '240px', fontWeight: 700, color: '#38bdf8', background: 'rgba(0,0,0,0.5)', cursor: 'text' }}
                  value="http://127.0.0.1:18923/#/timer"
                  onClick={(e) => e.target.select()}
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    navigator.clipboard.writeText('http://127.0.0.1:18923/#/timer');
                    showToast('📋 ¡URL de Timer copiada para OBS!');
                  }}
                >
                  📋 Copiar URL para OBS
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={openTimerPopout}
                >
                  🪟 Ventana Flotante (Pop-out)
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={downloadTimerHtml}
                >
                  📥 Descargar HTML
                </button>
              </div>

              {/* Step by step guide */}
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                <div><strong>1.</strong> En OBS Studio, haz clic en <strong>+ (Añadir Fuente) ➔ Navegador (Browser)</strong>.</div>
                <div><strong>2.</strong> En URL, pega: <code style={{ color: '#38bdf8' }}>http://127.0.0.1:18923/#/timer</code></div>
                <div><strong>3.</strong> Ajusta: Ancho: <strong>550</strong>, Alto: <strong>220</strong>. (El fondo es 100% transparente).</div>
              </div>
            </div>
          </div>
        )}`;

if (content.includes(oldTimerTab)) {
  content = content.replace(oldTimerTab, newTimerTab);
  console.log('✓ Replaced Extensible Timer Tab with complete Subathon station');
} else {
  console.error('✗ Could not find oldTimerTab');
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Finished writing Dashboard.jsx. New length:', content.length);
