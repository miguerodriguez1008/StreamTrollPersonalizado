import { useState, useEffect, useRef, useMemo } from 'react';

function formatTimerDigits(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return { hours, minutes, seconds, text: `${hh}:${mm}:${ss}` };
}

// Gentle Web Audio beep when time is added (no external audio assets required)
function playTimeAddedChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch {}
}

export default function TimerOverlay() {
  const [timerConfig, setTimerConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_timer_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      enabled: true,
      running: true,
      currentSeconds: 7200,
      title: 'SUBATÓN TIKTOK LIVE',
      style: 'neon-cyber',
      secondsPerCoin: 5,
      soundOnAdd: true,
      lastAdded: null
    };
  });

  const [activeAlerts, setActiveAlerts] = useState([]);
  const channelRef = useRef(null);
  const isChroma = typeof window !== 'undefined' && window.location.search.includes('chroma=1');

  // 1. Initial configuration fetch from local physical disk
  useEffect(() => {
    fetch('http://127.0.0.1:18923/api/config')
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg?.timerConfig) {
          setTimerConfig((prev) => ({ ...prev, ...cfg.timerConfig }));
        }
      })
      .catch(() => {});
  }, []);

  // 2. Real-time Synchronization across Overlay, OBS and Electron
  useEffect(() => {
    const handleTimerSync = (cfg) => {
      if (!cfg || typeof cfg !== 'object') return;
      setTimerConfig((prev) => {
        // Trigger alert banner if new time was added
        if (cfg.lastAdded && (!prev.lastAdded || cfg.lastAdded.timestamp !== prev.lastAdded.timestamp)) {
          triggerTimeAddedBanner(cfg.lastAdded);
          if (cfg.soundOnAdd !== false) playTimeAddedChime();
        }
        return { ...prev, ...cfg };
      });
    };

    // BroadcastChannel listener
    let channel = null;
    try {
      channel = new BroadcastChannel('stream_troll_overlay');
      channelRef.current = channel;
      channel.onmessage = (e) => {
        if (e.data?.type === 'TIMER_SYNC' && e.data?.timerConfig) {
          handleTimerSync(e.data.timerConfig);
        }
      };
    } catch {}

    // SSE Stream listener from OBS Server
    let es = null;
    try {
      es = new EventSource('http://127.0.0.1:18923/events');
      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.type === 'TIMER_SYNC' && parsed.timerConfig) {
            handleTimerSync(parsed.timerConfig);
          }
        } catch {}
      };
    } catch {}

    // LocalStorage storage event (browser tab sync)
    const onStorage = (e) => {
      if (e.key === 'stream_troll_timer_config' && e.newValue) {
        try {
          handleTimerSync(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);

    // Clean transparent background for OBS Studio
    document.body.style.backgroundColor = isChroma ? '#00ff00' : 'transparent';
    document.body.style.backgroundImage = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    return () => {
      if (channel) channel.close();
      if (es) es.close();
      window.removeEventListener('storage', onStorage);
    };
  }, [isChroma]);

  // 3. Local countdown tick every second when running is true
  useEffect(() => {
    if (!timerConfig.running) return;
    const interval = setInterval(() => {
      setTimerConfig((prev) => {
        if (!prev.running || prev.currentSeconds <= 0) return prev;
        return { ...prev, currentSeconds: Math.max(0, prev.currentSeconds - 1) };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerConfig.running]);

  const triggerTimeAddedBanner = (lastAdded) => {
    const alertId = Date.now() + Math.random();
    const newAlert = {
      id: alertId,
      seconds: lastAdded.seconds,
      reason: lastAdded.reason || 'Regalo Recibido'
    };
    setActiveAlerts((prev) => [...prev.slice(-3), newAlert]);

    setTimeout(() => {
      setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
    }, 3800);
  };

  const formatted = useMemo(
    () => formatTimerDigits(timerConfig.currentSeconds),
    [timerConfig.currentSeconds]
  );

  const isExpired = timerConfig.currentSeconds <= 0;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        userSelect: 'none',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        padding: '1.5rem',
        fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif"
      }}
    >
      {/* Floating Animated Added Time Badges */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          minHeight: '44px'
        }}
      >
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95))',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: 900,
              boxShadow: '0 8px 25px rgba(34, 197, 94, 0.5), 0 0 15px rgba(34, 197, 94, 0.3)',
              border: '1.5px solid #86efac',
              animation: 'bounceIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '0.5px'
            }}
          >
            <span>⏱️</span>
            <span>+{alert.seconds}s</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.95, fontWeight: 700 }}>
              ({alert.reason})
            </span>
          </div>
        ))}
      </div>

      {/* Main Extensible Timer Widget Card */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(12px)',
          border: isExpired
            ? '2.5px solid #ef4444'
            : '2.5px solid rgba(56, 189, 248, 0.7)',
          boxShadow: isExpired
            ? '0 15px 45px rgba(239, 68, 68, 0.4), inset 0 0 25px rgba(239, 68, 68, 0.2)'
            : '0 15px 45px rgba(56, 189, 248, 0.35), inset 0 0 25px rgba(56, 189, 248, 0.15)',
          borderRadius: '24px',
          padding: '1.25rem 2.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          minWidth: '320px',
          position: 'relative'
        }}
      >
        {/* Pulsing Status Dot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: isExpired ? '#fca5a5' : '#38bdf8'
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isExpired
                ? '#ef4444'
                : timerConfig.running
                ? '#22c55e'
                : '#f59e0b',
              boxShadow: `0 0 10px ${
                isExpired
                  ? '#ef4444'
                  : timerConfig.running
                  ? '#22c55e'
                  : '#f59e0b'
              }`
            }}
          />
          {timerConfig.title || 'EXTENSIBLE TIMER'}
        </div>

        {/* Big Crisp Digital Time Display */}
        <div
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '3.6rem',
            fontWeight: 900,
            color: isExpired ? '#ef4444' : '#ffffff',
            textShadow: isExpired
              ? '0 0 20px rgba(239, 68, 68, 0.8)'
              : '0 0 25px rgba(56, 189, 248, 0.8), 0 0 50px rgba(6, 182, 212, 0.4)',
            letterSpacing: '4px',
            lineHeight: 1
          }}
        >
          {formatted.text}
        </div>

        {/* Footer Subtext: Coins rule reminder */}
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🪙 1 Moneda = +{timerConfig.secondsPerCoin || 5}s</span>
          <span>•</span>
          <span>{timerConfig.running ? '▶ En Vivo' : '⏸️ Pausado'}</span>
        </div>
      </div>
    </div>
  );
}

