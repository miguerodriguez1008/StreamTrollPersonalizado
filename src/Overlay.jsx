import { useEffect, useState, useRef, useCallback } from 'react';
import regalosData from './regalos.json';

const channel = new BroadcastChannel('stream_troll_channel');

const REGALOS_IMAGE_MAP = {};
(regalosData?.gifts || []).forEach((g) => {
  if (g.name && g.image) {
    const raw = String(g.name).toLowerCase().trim();
    REGALOS_IMAGE_MAP[raw] = g.image;
    const norm = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    if (norm) REGALOS_IMAGE_MAP[norm] = g.image;
  }
});

const EFFECT_META = {
  drunk: { icon: '🥴', label: 'DRUNK MODE (MAREO)', color: '#ec4899' },
  mirror: { icon: '🪞', label: 'MIRROR / PANTALLA INVERTIDA', color: '#38bdf8' },
  blur: { icon: '👓', label: 'BLUR / MIOPÍA EXTREMA', color: '#a855f7' },
  glitch: { icon: '👾', label: 'CYBER GLITCH RETRO', color: '#10b981' },
  flashbang: { icon: '💥', label: 'FLASHBANG CEGADOR', color: '#f8fafc' },
  gameboy: { icon: '🟩', label: 'RETRO GAME BOY 8-BIT', color: '#84cc16' },
  invert: { icon: '☯️', label: 'COLORES INVERTIDOS', color: '#f59e0b' },
  earthquake: { icon: '🌋', label: 'TERREMOTO NIVEL 9', color: '#ef4444' },
  vintage: { icon: '🎞️', label: 'PELÍCULA VINTAGE SEPIA', color: '#d97706' },
  close_app: { icon: '❌', label: '¡CERRAR JUEGO (ALT+F4)!', color: '#ef4444' },
  minimize_game: { icon: '🖥️', label: '¡MANDAR AL ESCRITORIO (WIN+D)!', color: '#f59e0b' },
  alt_tab: { icon: '🔄', label: '¡ALT + TAB TROLL!', color: '#8b5cf6' },
  close_tiktok_studio: { icon: '🛑', label: '¡TIKTOK LIVE STUDIO CERRADO!', color: '#ff0050' },
  stop_stream_tiktok: { icon: '🛑', label: '¡TIKTOK LIVE STUDIO CERRADO!', color: '#ff0050' },
  stop_stream: { icon: '🛑', label: '¡STREAM Y OBS CERRADOS!', color: '#ef4444' },
  fake_stream_ended: { icon: '🎭', label: '¡STREAM CAÍDO (TROLL FALSO)!', color: '#dc2626' },
  screamer: { icon: '😱', label: '¡SUSTO / SCREAMER AGUDO!', color: '#ef4444' },
  fbi: { icon: '🚨', label: '¡SIRENA FBI / POLICÍA!', color: '#3b82f6' },
  knock: { icon: '🚪', label: '¡GOLPE EN LA PUERTA (KNOCK)!', color: '#f59e0b' }
};

const playFakeStreamSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // 1. White noise burst (estática de televisión)
    const bufferSize = ctx.sampleRate * 0.45;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    whiteNoise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start();

    // 2. Continuous test tone / beep (pitido de desconexión 1000Hz)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.08);
    oscGain.gain.setValueAtTime(0.25, ctx.currentTime + 0.08);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(ctx.currentTime + 0.08);
    osc.stop(ctx.currentTime + 1.45);
  } catch (e) {
    console.warn('Audio synthesis error:', e);
  }
};

const playGraphicSound = (soundType) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (soundType === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (soundType === 'epic') {
      [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.55);
      });
    } else if (soundType === 'coin') {
      [987.77, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.35);
      });
    } else if (soundType === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (soundType === 'screamer') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1300, ctx.currentTime);
      osc.frequency.setValueAtTime(350, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.55, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } else if (soundType === 'fbi') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
    } else if (soundType === 'knock') {
      [0, 0.12, 0.24].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + delay + 0.08);
        gain.gain.setValueAtTime(0.5, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.09);
      });
    }
  } catch {}
};

const OVERLAY_TIKTOK_CDN_IMAGES = {
  rose: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp',
  rosa: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp',
  5655: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp',
  panda: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/b6655c65a4159518d6a894a4a1ca2fb0~tplv-obj.webp',
  5652: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/b6655c65a4159518d6a894a4a1ca2fb0~tplv-obj.webp',
  dona: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4e7ad6bdf0a1d860c538f38026d4e812~tplv-obj.webp',
  doughnut: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4e7ad6bdf0a1d860c538f38026d4e812~tplv-obj.webp',
  5879: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4e7ad6bdf0a1d860c538f38026d4e812~tplv-obj.webp',
  leon: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4fb89af2082a290b37d704e20f4fe729~tplv-obj.webp',
  lion: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4fb89af2082a290b37d704e20f4fe729~tplv-obj.webp',
  6427: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4fb89af2082a290b37d704e20f4fe729~tplv-obj.webp'
};

const emojiToHex = (emoji) => {
  if (!emoji) return '1f381';
  for (const char of Array.from(String(emoji).trim())) {
    const cp = char.codePointAt(0);
    if (cp && cp !== 0xfe0f && cp !== 0x200d) return cp.toString(16);
  }
  return '1f381';
};

function OverlayGiftImg({ item, size = 28 }) {
  const rawName = String(item?.giftName || '').toLowerCase().trim();
  const normName = rawName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

  const candidates = [
    item?.giftImage,
    item?.imageUrl,
    REGALOS_IMAGE_MAP[rawName],
    REGALOS_IMAGE_MAP[normName],
    item?.giftId ? OVERLAY_TIKTOK_CDN_IMAGES[item.giftId] : null,
    OVERLAY_TIKTOK_CDN_IMAGES[normName],
    `https://fonts.gstatic.com/s/e/notoemoji/latest/${emojiToHex(item?.giftIcon || '🎁')}/512.webp`,
    `https://emojicdn.elk.sh/${encodeURIComponent(item?.giftIcon || '🎁')}?style=apple`
  ].filter(Boolean);

  const [idx, setIdx] = useState(0);
  if (idx >= candidates.length) {
    return <span>{item?.giftIcon || '🎁'}</span>;
  }
  return (
    <img
      src={candidates[idx]}
      alt={item?.giftName || 'Gift'}
      onError={() => setIdx((i) => i + 1)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))',
        display: 'block'
      }}
    />
  );
}

const DEFAULT_OVERLAY_MAPPINGS = [
  { id: 'map-1', giftId: 5655, giftName: 'Rose', giftIcon: '🌹', minCoins: 1, effect: 'drunk', duration: 6, enabled: true },
  { id: 'map-2', giftId: 5652, giftName: 'Panda', giftIcon: '🐼', minCoins: 5, effect: 'gameboy', duration: 8, enabled: true },
  { id: 'map-3', giftId: 6427, giftName: 'León', giftIcon: '🦁', minCoins: 29999, effect: 'flashbang', duration: 8, enabled: true },
  { id: 'map-4', giftId: 5879, giftName: 'Dona', giftIcon: '🍩', minCoins: 30, effect: 'earthquake', duration: 6, enabled: true }
];

const DEFAULT_SLIDER_CONFIG = {
  enabled: true,
  mode: 'marquee',
  position: 'top',
  spacingY: 16,
  gap: 18,
  speed: 18,
  scale: 1,
  reserveSpace: true,
  showOnDesktop: false,
  showOnMainOverlay: false
};

function Overlay() {
  const [activeEffect, setActiveEffect] = useState('');
  const [effectRemainingMs, setEffectRemainingMs] = useState(0);
  const [effectKey, setEffectKey] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [activeGiftGraphics, setActiveGiftGraphics] = useState([]);
  const [graphicsEnabled, setGraphicsEnabled] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showStatus, setShowStatus] = useState(true);

  const [giftMappings, setGiftMappings] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_mappings');
      return saved ? JSON.parse(saved) : DEFAULT_OVERLAY_MAPPINGS;
    } catch {
      return DEFAULT_OVERLAY_MAPPINGS;
    }
  });

  const [sliderConfig, setSliderConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_slider_config');
      return saved ? { ...DEFAULT_SLIDER_CONFIG, ...JSON.parse(saved) } : DEFAULT_SLIDER_CONFIG;
    } catch {
      return DEFAULT_SLIDER_CONFIG;
    }
  });

  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const graphicsEnabledRef = useRef(true);
  const effectTimeoutRef = useRef(null);
  const processedEventIdsRef = useRef(new Set());

  const isChroma = window.location.href.includes('chroma=true');
  const isDesktopOverlay = window.location.href.includes('desktop=true');

  useEffect(() => {
    graphicsEnabledRef.current = graphicsEnabled;
  }, [graphicsEnabled]);

  const handleIncomingPayload = useCallback((data) => {
    if (!data || typeof data !== 'object') return;

    // Deduplicate events received over multiple transports (BroadcastChannel + SSE + IPC)
    if (data.eventId) {
      if (processedEventIdsRef.current.has(data.eventId)) return;
      processedEventIdsRef.current.add(data.eventId);
      if (processedEventIdsRef.current.size > 200) {
        const first = processedEventIdsRef.current.values().next().value;
        processedEventIdsRef.current.delete(first);
      }
    }

    if (data.type === 'ENGINE_CONFIG') {
      if (typeof data.graphicsEngine === 'boolean') {
        setGraphicsEnabled(data.graphicsEngine);
        graphicsEnabledRef.current = data.graphicsEngine;
        if (!data.graphicsEngine) {
          setActiveEffect('');
        }
      }
      if (typeof data.alignmentGrid === 'boolean') {
        setShowGrid(data.alignmentGrid);
      }
      if (Array.isArray(data.giftMappings)) {
        setGiftMappings(data.giftMappings);
      }
      if (data.sliderConfig && typeof data.sliderConfig === 'object') {
        setSliderConfig((prev) => ({ ...prev, ...data.sliderConfig }));
      }
    } else if (data.type === 'SHADER') {
      if (graphicsEnabledRef.current) {
        const duration = data.duration || 5000;
        setActiveEffect(data.effect);
        setEffectRemainingMs(duration);
        setEffectKey((prev) => prev + 1);

        if (data.effect === 'fake_stream_ended' || data.effect === 'close_tiktok_studio' || data.effect === 'stop_stream') {
          playFakeStreamSound();
        } else if (data.effect === 'screamer' || data.effect === 'fbi' || data.effect === 'knock') {
          playGraphicSound(data.effect);
        }

        if (effectTimeoutRef.current) {
          clearTimeout(effectTimeoutRef.current);
        }
        effectTimeoutRef.current = setTimeout(() => {
          setActiveEffect('');
          setEffectRemainingMs(0);
        }, duration);
      }
    } else if (data.type === 'ALERT') {
      const id = Date.now() + Math.random();

      // Avoid double TTS audio if both the Desktop Overlay and OBS Browser Source are active
      const shouldSpeak = data.tts && window.speechSynthesis && !(isDesktopOverlay && data.hasObsClients);
      if (shouldSpeak) {
        try {
          window.speechSynthesis.cancel();
          const textToRead = `${data.user} ha enviado ${data.amount}. ${data.message}`;
          const utterance = new SpeechSynthesisUtterance(textToRead);
          utterance.lang = 'es-ES';
          utterance.rate = 1.1;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.warn('TTS error:', e);
        }
      }

      setAlerts((prev) => [...prev, { ...data, id }]);
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }, 8000);
    } else if (data.type === 'GIFT_GRAPHIC') {
      const g = data.graphic;
      if (!g) return;
      const id = Date.now() + Math.random();
      const pCount = Math.min(45, Math.max(8, g.particleCount || 22));
      const particles = Array.from({ length: pCount }, (_, idx) => ({
        id: `${id}_p_${idx}`,
        left: Math.floor(Math.random() * 88 + 6),
        delay: (Math.random() * 1.6).toFixed(2),
        speed: (2.0 + Math.random() * 1.5).toFixed(2),
        size: Math.floor(34 + Math.random() * 32),
        rot: Math.floor(Math.random() * 360 - 180)
      }));

      if (g.sound && g.sound !== 'silent') {
        playGraphicSound(g.sound);
      }

      const dur = (g.duration || 5) * 1000;
      setActiveGiftGraphics((prev) => [...prev, { ...g, id, particles }]);
      setTimeout(() => {
        setActiveGiftGraphics((prev) => prev.filter((item) => item.id !== id));
      }, dur);
    }
  }, [isDesktopOverlay]);

  useEffect(() => {
    // Add overlay classes to ensure 100% full-screen coverage in all viewports/browsers
    document.documentElement.classList.add('overlay-active');
    document.body.classList.add('overlay-active');
    document.body.style.backgroundColor = isChroma ? '#00ff00' : 'transparent';
    document.body.style.backgroundImage = 'none';
    document.body.style.color = 'white';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';

    // Hide status banner after 4 seconds so it doesn't show in live stream
    const timer = setTimeout(() => setShowStatus(false), 4000);

    // 1. Same-browser BroadcastChannel listener (for Pop-out Windows)
    const onChannelMsg = (event) => handleIncomingPayload(event.data);
    channel.addEventListener('message', onChannelMsg);

    // 2. Native Electron IPC listener (for Desktop Click-Through Overlay Window)
    let ipcRenderer = null;
    const onIpcEvent = (_evt, payload) => handleIncomingPayload(payload);
    if (typeof window !== 'undefined' && window.require) {
      try {
        ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.on('overlay:event', onIpcEvent);
      } catch {}
    }

    // 3. Real-time SSE connections for OBS Studio Browser Source (cross-process)
    const sseSources = [];
    const endpoints = new Set(['http://127.0.0.1:18923/events']);
    if (window.location.protocol.startsWith('http') && !window.location.origin.includes('18923')) {
      endpoints.add(`${window.location.origin}/events`);
    }

    endpoints.forEach((url) => {
      try {
        const es = new EventSource(url);
        es.onmessage = (e) => {
          try {
            const parsed = JSON.parse(e.data);
            handleIncomingPayload(parsed);
          } catch {}
        };
        sseSources.push(es);
      } catch {}
    });

    // 3.5. Real-time WebSocket bridge (ws://127.0.0.1:18923)
    let ws = null;
    let wsRetry = null;
    let isUnmounted = false;
    function connectWs() {
      if (isUnmounted) return;
      try {
        ws = new WebSocket('ws://127.0.0.1:18923');
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleIncomingPayload(data);
          } catch {}
        };
        ws.onclose = () => {
          if (!isUnmounted) wsRetry = setTimeout(connectWs, 3000);
        };
        ws.onerror = () => {
          try { ws.close(); } catch {}
        };
      } catch {
        if (!isUnmounted) wsRetry = setTimeout(connectWs, 3000);
      }
    }
    connectWs();

    // 4. Initial load from StreamTroll physical disk config
    fetch('http://127.0.0.1:18923/api/config')
      .then((r) => r.json())
      .then((cfg) => {
        if (Array.isArray(cfg?.giftMappings) && cfg.giftMappings.length > 0) {
          setGiftMappings(cfg.giftMappings);
        }
        if (cfg?.sliderConfig) {
          setSliderConfig((prev) => ({ ...prev, ...cfg.sliderConfig }));
        }
      })
      .catch(() => {});

    return () => {
      isUnmounted = true;
      if (ws) {
        try { ws.close(); } catch {}
      }
      if (wsRetry) clearTimeout(wsRetry);
      clearTimeout(timer);
      if (effectTimeoutRef.current) clearTimeout(effectTimeoutRef.current);
      channel.removeEventListener('message', onChannelMsg);
      if (ipcRenderer) {
        try { ipcRenderer.removeListener('overlay:event', onIpcEvent); } catch {}
      }
      sseSources.forEach((es) => {
        try { es.close(); } catch {}
      });
      document.documentElement.classList.remove('overlay-active');
      document.body.classList.remove('overlay-active');
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
      document.body.style.color = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, [isChroma, handleIncomingPayload]);

  const activeMappedGifts = giftMappings.filter((m) => m.enabled);
  const showGiftSlider =
    sliderConfig.enabled &&
    sliderConfig.showOnMainOverlay === true &&
    activeMappedGifts.length > 0 &&
    (!isDesktopOverlay || sliderConfig.showOnDesktop);

  useEffect(() => {
    if (!showGiftSlider || sliderConfig.mode !== 'spotlight' || activeMappedGifts.length <= 1) return;
    const intervalMs = Math.max(2500, Math.round((sliderConfig.speed || 16) * 250));
    const id = setInterval(() => {
      setSpotlightIndex((i) => (i + 1) % activeMappedGifts.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [showGiftSlider, sliderConfig.mode, sliderConfig.speed, activeMappedGifts.length]);

  const currentMeta = activeEffect ? EFFECT_META[activeEffect] : null;
  const topReservedOffset =
    showGiftSlider && sliderConfig.position === 'top' && sliderConfig.reserveSpace
      ? (sliderConfig.spacingY || 16) + 74
      : 24;

  const spotlightGift =
    activeMappedGifts.length > 0
      ? activeMappedGifts[spotlightIndex % activeMappedGifts.length]
      : null;

  return (
    <div className={`overlay-container ${activeEffect} overlay-page-root`}>
      {/* =========================================================
          DEDICATED MAPPED GIFTS SLIDER BAR (OBS OVERLAY)
          ========================================================= */}
      {showGiftSlider && (
        <div
          className="overlay-gift-slider-zone"
          style={{
            top: sliderConfig.position === 'top' ? `${sliderConfig.spacingY || 16}px` : 'auto',
            bottom: sliderConfig.position === 'bottom' ? `${sliderConfig.spacingY || 16}px` : 'auto'
          }}
        >
          {sliderConfig.mode === 'spotlight' && spotlightGift ? (
            <div
              key={spotlightGift.id}
              className="gift-slider-pill gift-slider-spotlight-card"
              style={{ transform: `scale(${sliderConfig.scale || 1})` }}
            >
              <span className="gift-slider-pill-icon">
                <OverlayGiftImg item={spotlightGift} size={30} />
              </span>
              <div className="gift-slider-pill-info">
                <span className="gift-slider-pill-name">{spotlightGift.giftName}</span>
                <span className="gift-slider-pill-coins">🪙 {spotlightGift.minCoins}</span>
              </div>
              <span className="gift-slider-pill-arrow">➔</span>
              <span className="gift-slider-pill-effect">
                ✨ {spotlightGift.effect.toUpperCase()} ({spotlightGift.duration}s)
              </span>
              <span className="gift-slider-counter">
                {(spotlightIndex % activeMappedGifts.length) + 1}/{activeMappedGifts.length}
              </span>
            </div>
          ) : (
            <div className="slider-standalone-track-container" style={{ width: '100%', overflow: 'hidden' }}>
              <div
                className="slider-standalone-track"
                style={{
                  gap: `${sliderConfig.gap || 34}px`,
                  animationDuration: `${sliderConfig.speed || 18}s`,
                  transform: `scale(${sliderConfig.scale || 1})`,
                  display: 'flex',
                  alignItems: 'flex-end',
                  width: 'max-content',
                  animation: `giftSliderMarquee ${sliderConfig.speed || 18}s linear infinite`
                }}
              >
                {[...activeMappedGifts, ...activeMappedGifts, ...activeMappedGifts, ...activeMappedGifts].map((m, idx) => (
                  <div key={`${m.id}-${idx}`} className="slider-streamer-meme-item">
                    <div className="slider-streamer-icon-wrap">
                      <OverlayGiftImg item={m} size={82} />
                    </div>
                    <div className="slider-streamer-meme-text">
                      {m.customLabel ? m.customLabel.toUpperCase() : m.giftName.toUpperCase()}
                    </div>
                    {sliderConfig.showCoins !== false && (
                      <div className="slider-streamer-coins-pill">
                        🪙 {m.minCoins}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Shader Visual FX Layer for OBS Transparent Browser Source */}
      {activeEffect && (
        <div key={`${activeEffect}-${effectKey}`} className={`shader-fx-layer shader-fx-${activeEffect}`}>
          {activeEffect === 'glitch' && (
            <>
              <div className="glitch-scanlines" />
              <div className="glitch-bar glitch-bar-1" />
              <div className="glitch-bar glitch-bar-2" />
            </>
          )}
          {activeEffect === 'drunk' && <div className="drunk-vignette" />}
          {activeEffect === 'blur' && <div className="blur-frost-overlay" />}
          {activeEffect === 'gameboy' && <div className="gameboy-matrix-overlay" />}
          {activeEffect === 'vintage' && <div className="vintage-film-overlay" />}
          {activeEffect === 'earthquake' && <div className="earthquake-danger-frame" />}
          {activeEffect === 'mirror' && <div className="mirror-hud-frame" />}
          {activeEffect === 'invert' && <div className="invert-psychedelic-overlay" />}
          {activeEffect === 'close_app' && (
            <div className="close-app-troll-overlay">
              <div className="close-app-alert-box">
                <div className="close-app-skull">💀</div>
                <div className="close-app-title">¡JUEGO CERRADO!</div>
                <div className="close-app-subtitle">Alt + F4 Activado por el Stream</div>
              </div>
            </div>
          )}
          {activeEffect === 'minimize_game' && (
            <div className="close-app-troll-overlay minimize">
              <div className="close-app-alert-box">
                <div className="close-app-skull">🖥️</div>
                <div className="close-app-title">¡MANDADO AL ESCRITORIO!</div>
                <div className="close-app-subtitle">Juego Minimizado en Plena Partida</div>
              </div>
            </div>
          )}
          {activeEffect === 'alt_tab' && (
            <div className="close-app-troll-overlay alttab">
              <div className="close-app-alert-box">
                <div className="close-app-skull">🔄</div>
                <div className="close-app-title">¡ALT + TAB TROLL!</div>
                <div className="close-app-subtitle">Cambiando de Ventana en Directo</div>
              </div>
            </div>
          )}
          {(activeEffect === 'close_tiktok_studio' || activeEffect === 'stop_stream_tiktok') && (
            <div className="close-app-troll-overlay stopstream" style={{ border: '3px solid #ff0050', boxShadow: '0 0 60px rgba(255, 0, 80, 0.7)' }}>
              <div className="close-app-alert-box" style={{ border: '2px solid #ff0050', background: 'rgba(20, 0, 10, 0.95)' }}>
                <div className="close-app-skull" style={{ fontSize: '3.5rem' }}>📴</div>
                <div className="close-app-title" style={{ color: '#ff0050' }}>¡TIKTOK LIVE STUDIO CERRADO!</div>
                <div className="close-app-subtitle">Stream de TikTok Apagado y Programa Finalizado</div>
              </div>
            </div>
          )}
          {activeEffect === 'stop_stream' && (
            <div className="close-app-troll-overlay stopstream">
              <div className="close-app-alert-box">
                <div className="close-app-skull">🛑</div>
                <div className="close-app-title">¡OBS CERRADO Y STREAM APAGADO!</div>
                <div className="close-app-subtitle">OBS Studio Cerrado por Completo en Vivo</div>
              </div>
            </div>
          )}
          {activeEffect === 'fake_stream_ended' && (
            <div className="fake-stream-ended-overlay">
              <div className="fake-stream-ended-scanlines" />
              <div className="fake-stream-ended-card">
                <div className="fake-stream-ended-icon">
                  <div className="fake-live-dot" />
                  📡
                </div>
                <div className="fake-stream-ended-title">EL DIRECTO HA TERMINADO</div>
                <div className="fake-stream-ended-sub">
                  El creador ha finalizado la transmisión en vivo o se ha perdido la conexión.
                </div>
                <div className="fake-stream-ended-footer">
                  <span className="fake-badge">TikTok LIVE</span>
                  <span>Gracias por ver</span>
                </div>
              </div>
              <div className="fake-stream-ended-stamp">
                😂 ¡TROLEO DE STREAM! 😂
                <span className="fake-stream-ended-stamp-sub">EL STREAM SIGUE VIVO</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Shader HUD Pill on Stream */}
      {currentMeta && (
        <div
          style={{
            position: 'fixed',
            top: `${topReservedOffset}px`,
            right: '24px',
            background: 'rgba(15, 23, 42, 0.88)',
            border: `2px solid ${currentMeta.color}`,
            boxShadow: `0 0 25px ${currentMeta.color}80`,
            borderRadius: '999px',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 100001,
            animation: 'slideIn 0.3s ease-out forwards'
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>{currentMeta.icon}</span>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '1px' }}>
              STREAM TROLL SHADER ACTIVO
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>
              {currentMeta.label} ({Math.ceil(effectRemainingMs / 1000)}s)
            </div>
          </div>
        </div>
      )}

      {/* Alignment Grid Overlay */}
      {showGrid && (
        <div style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.25) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          border: '2px dashed rgba(59, 130, 246, 0.6)',
          zIndex: 9998
        }}>
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            📐 ALIGNMENT GRID (OBS STUDIO / STREAM TROLL)
          </div>
        </div>
      )}

      {showStatus && (
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.75)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #4ade80', transition: 'opacity 0.5s', zIndex: 99999 }}>
          <span style={{color: '#4ade80', fontWeight: 'bold'}}>🟢 OVERLAY ACTIVO Y CONECTADO EN TIEMPO REAL</span>
          <br/>
          <span style={{fontSize: '12px', color: '#ccc'}}>Listo para recibir alertas y shaders en OBS Studio.</span>
        </div>
      )}
      
      <div
        className="alerts-container"
        style={{
          top:
            showGiftSlider && sliderConfig.position === 'top' && sliderConfig.reserveSpace
              ? `calc(10% + ${(sliderConfig.spacingY || 16) + 56}px)`
              : '10%'
        }}
      >
        {alerts.map((alert) => (
          <div key={alert.id} className="fake-alert slide-in">
            <div className="alert-icon">💸</div>
            <div className="alert-content">
              <div className="alert-title">
                <span className="alert-user">{alert.user}</span> envió <span className="alert-amount">{alert.amount}</span>
              </div>
              <div className="alert-msg">"{alert.message}"</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Animated Gift Graphics (Rain, Epic Center Burst, Rockets, Floating Bouncers) */}
      {activeGiftGraphics.map((item) => (
        <div key={item.id} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100050, overflow: 'hidden' }}>
          {/* Top Donor Pill Banner */}
          <div
            style={{
              position: 'absolute',
              top: '28px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.94)',
              border: '2px solid #fbbf24',
              borderRadius: '999px',
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 25px rgba(251, 191, 36, 0.6)',
              animation: 'slideIn 0.35s ease-out'
            }}
          >
            <span style={{ fontSize: '2rem' }}>{item.icon || '🎁'}</span>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800, letterSpacing: '1px' }}>
                ANIMACIÓN DE REGALO EN VIVO
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff' }}>
                <span style={{ color: '#38bdf8' }}>{item.user || 'Espectador'}</span> envió <strong>{item.triggerGift || item.giftName || item.name}</strong>
              </div>
            </div>
          </div>

          {/* 1. RAIN ANIMATION */}
          {(item.animationType === 'rain' || item.animationType === 'heart_burst') && (
            item.particles.map((p) => (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  top: '-90px',
                  left: `${p.left}%`,
                  fontSize: `${p.size}px`,
                  animation: `giftRainFall ${p.speed}s linear infinite`,
                  animationDelay: `${p.delay}s`,
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
                  userSelect: 'none'
                }}
              >
                {item.image ? (
                  <img src={item.image} alt="gift" style={{ width: `${p.size}px`, height: `${p.size}px`, objectFit: 'contain' }} />
                ) : (
                  item.icon || '🌹'
                )}
              </div>
            ))
          )}

          {/* 2. EPIC / BURST ANIMATION */}
          {(item.animationType === 'epic' || item.animationType === 'burst') && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'giftBurstPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  border: '4px solid rgba(251, 191, 36, 0.8)',
                  animation: 'giftEpicShockwave 1.5s ease-out infinite'
                }}
              />
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt="gift"
                    style={{ width: '220px', height: '220px', objectFit: 'contain', filter: 'drop-shadow(0 0 35px rgba(234, 179, 8, 0.8))' }}
                  />
                ) : (
                  <div style={{ fontSize: '7.5rem', filter: 'drop-shadow(0 0 35px rgba(234, 179, 8, 0.8))' }}>
                    {item.icon || '🦁'}
                  </div>
                )}
                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: '#fff',
                    textShadow: '0 0 20px #fbbf24, 0 4px 8px #000',
                    fontFamily: "'Titan One', 'Fredoka', cursive, sans-serif",
                    letterSpacing: '2px'
                  }}
                >
                  {item.name.toUpperCase()}
                </div>
              </div>
            </div>
          )}

          {/* 3. ROCKET ANIMATION */}
          {item.animationType === 'rocket' && (
            <div
              style={{
                position: 'absolute',
                bottom: '-120px',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'giftRocketLaunch 3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: '6.5rem', filter: 'drop-shadow(0 0 25px #f97316)' }}>
                {item.icon || '🚀'}
              </div>
              <div style={{ width: '12px', height: '140px', background: 'linear-gradient(to bottom, #f97316, transparent)', borderRadius: '6px' }} />
            </div>
          )}

          {/* 4. BOUNCE ANIMATION */}
          {item.animationType === 'bounce' && (
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '40%',
                fontSize: '5rem',
                animation: 'giftFloatingBounce 2s ease-in-out infinite',
                filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.7))'
              }}
            >
              {item.image ? (
                <img src={item.image} alt="bounce" style={{ width: '130px', height: '130px', objectFit: 'contain' }} />
              ) : (
                item.icon || '🪂'
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Overlay;
