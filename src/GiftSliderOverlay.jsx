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

const EFFECT_COLORS = {
  drunk: { border: '#ec4899', badgeBg: 'rgba(236, 72, 153, 0.25)', text: '#fbcfe8', label: 'DRUNK' },
  mirror: { border: '#38bdf8', badgeBg: 'rgba(56, 189, 248, 0.25)', text: '#bae6fd', label: 'MIRROR' },
  blur: { border: '#a855f7', badgeBg: 'rgba(168, 85, 247, 0.25)', text: '#e9d5ff', label: 'BLUR' },
  glitch: { border: '#10b981', badgeBg: 'rgba(16, 185, 129, 0.25)', text: '#a7f3d0', label: 'GLITCH' },
  flashbang: { border: '#f8fafc', badgeBg: 'rgba(255, 255, 255, 0.3)', text: '#ffffff', label: 'FLASHBANG' },
  gameboy: { border: '#84cc16', badgeBg: 'rgba(132, 204, 22, 0.25)', text: '#d9f99d', label: 'GAMEBOY' },
  invert: { border: '#f59e0b', badgeBg: 'rgba(245, 158, 11, 0.25)', text: '#fde68a', label: 'INVERT' },
  earthquake: { border: '#ef4444', badgeBg: 'rgba(239, 68, 68, 0.25)', text: '#fecaca', label: 'EARTHQUAKE' },
  vintage: { border: '#d97706', badgeBg: 'rgba(217, 119, 6, 0.25)', text: '#fed7aa', label: 'VINTAGE' },
  close_tiktok_studio: { border: '#ff0050', badgeBg: 'rgba(255, 0, 80, 0.25)', text: '#ffb3c6', label: 'OFF TIKTOK' },
  stop_stream_tiktok: { border: '#ff0050', badgeBg: 'rgba(255, 0, 80, 0.25)', text: '#ffb3c6', label: 'OFF TIKTOK' },
  stop_stream: { border: '#ef4444', badgeBg: 'rgba(239, 68, 68, 0.25)', text: '#fecaca', label: 'STOP OBS' },
  close_app: { border: '#dc2626', badgeBg: 'rgba(220, 38, 38, 0.25)', text: '#fca5a5', label: 'ALT+F4' }
};

const OFFICIAL_TIKTOK_CDN = {
  rose: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp',
  5655: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp',
  'ice-cream': 'https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/a254cce3-3662-4c0e-84d7-d06bf3af3e2e.png~tplv-obj.png',
  5827: 'https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/a254cce3-3662-4c0e-84d7-d06bf3af3e2e.png~tplv-obj.png',
  'finger-heart': 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/a4c4dc437fd3a6632aba149769491f49.png~tplv-obj.webp',
  5487: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/a4c4dc437fd3a6632aba149769491f49.png~tplv-obj.webp',
  panda: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/b6655c65a4159518d6a894a4a1ca2fb0~tplv-obj.webp',
  5652: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/b6655c65a4159518d6a894a4a1ca2fb0~tplv-obj.webp',
  perfume: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/20b8f61246c7b6032777bb81bf4ee055~tplv-obj.webp',
  5658: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/20b8f61246c7b6032777bb81bf4ee055~tplv-obj.webp',
  doughnut: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4e7ad6bdf0a1d860c538f38026d4e812~tplv-obj.webp',
  dona: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4e7ad6bdf0a1d860c538f38026d4e812~tplv-obj.webp',
  5879: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4e7ad6bdf0a1d860c538f38026d4e812~tplv-obj.webp',
  'cap-moustache': 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/809c9cb443224b810d29ab6ac050302b~tplv-obj.webp',
  6104: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/809c9cb443224b810d29ab6ac050302b~tplv-obj.webp',
  confetti: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/3815e12ec6f481e3328e3b08e2f8319f~tplv-obj.webp',
  5585: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/3815e12ec6f481e3328e3b08e2f8319f~tplv-obj.webp',
  'sports-car': 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/484f474784770636acca4568c1294cb6~tplv-obj.image',
  5509: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/484f474784770636acca4568c1294cb6~tplv-obj.image',
  lion: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4fb89af2082a290b37d704e20f4fe729~tplv-obj.webp',
  leon: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4fb89af2082a290b37d704e20f4fe729~tplv-obj.webp',
  6427: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4fb89af2082a290b37d704e20f4fe729~tplv-obj.webp',
  galaxy: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/8f471afbcebfda3841a6cc515e381f58~tplv-obj.webp',
  6093: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/8f471afbcebfda3841a6cc515e381f58~tplv-obj.webp',
  universe: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/8f471afbcebfda3841a6cc515e381f58~tplv-obj.webp',
  5566: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/8f471afbcebfda3841a6cc515e381f58~tplv-obj.webp'
};

const emojiToHex = (emoji) => {
  if (!emoji) return '1f381';
  for (const char of Array.from(String(emoji).trim())) {
    const cp = char.codePointAt(0);
    if (cp && cp !== 0xfe0f && cp !== 0x200d) return cp.toString(16);
  }
  return '1f381';
};

function SliderGiftImage({ item, size = 32 }) {
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
    item?.giftId ? OFFICIAL_TIKTOK_CDN[item.giftId] : null,
    OFFICIAL_TIKTOK_CDN[normName],
    `https://fonts.gstatic.com/s/e/notoemoji/latest/${emojiToHex(item?.giftIcon || '🎁')}/512.webp`,
    `https://emojicdn.elk.sh/${encodeURIComponent(item?.giftIcon || '🎁')}?style=apple`
  ].filter(Boolean);

  const [idx, setIdx] = useState(0);

  if (idx >= candidates.length) {
    return <span style={{ fontSize: `${size * 0.85}px`, lineHeight: 1 }}>{item?.giftIcon || '🎁'}</span>;
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
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))',
        display: 'block',
        flexShrink: 0
      }}
    />
  );
}

const DEFAULT_MAPPINGS = [
  { id: 'map-1', giftId: 5655, giftName: 'Rose', customLabel: 'ROSA TIKTOK', giftIcon: '🌹', minCoins: 1, effect: 'drunk', duration: 6, enabled: true, ttsVoice: true },
  { id: 'map-2', giftId: 5652, giftName: 'Panda', customLabel: 'PEDRO SONG', giftIcon: '🐼', minCoins: 5, effect: 'gameboy', duration: 8, enabled: true, ttsVoice: true },
  { id: 'map-3', giftId: 6427, giftName: 'León', customLabel: 'QUIERE QUE BAILE', giftIcon: '🦁', minCoins: 29999, effect: 'flashbang', duration: 8, enabled: true, ttsVoice: true },
  { id: 'map-4', giftId: 5879, giftName: 'Dona', customLabel: 'CARTEL SONG', giftIcon: '🍩', minCoins: 30, effect: 'earthquake', duration: 6, enabled: true, ttsVoice: true }
];

const DEFAULT_SLIDER_SETTINGS = {
  enabled: true,
  mode: 'marquee',         // 'marquee' | 'spotlight' | 'static'
  theme: 'streamer',       // 'streamer' (Meme style: 3D gift + bold text like photo) | 'cyber' | 'tiktok' | 'gold' | 'minimal'
  speed: 18,               // duration in seconds
  scale: 1.0,              // scale factor (0.8 - 1.4)
  gap: 28,                 // space between cards
  showBadge: false,        // in streamer meme mode, default to clean floating items
  badgeText: '🎁 REGALOS ACTIVOS',
  showCoins: false,
  showEffect: false,
  showOnMainOverlay: false
};

export default function GiftSliderOverlay() {
  const [giftMappings, setGiftMappings] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_mappings') || localStorage.getItem('stream_troll_gift_mappings');
      return saved ? JSON.parse(saved) : DEFAULT_MAPPINGS;
    } catch {
      return DEFAULT_MAPPINGS;
    }
  });

  const [sliderConfig, setSliderConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_slider_config');
      return saved ? { ...DEFAULT_SLIDER_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SLIDER_SETTINGS;
    } catch {
      return DEFAULT_SLIDER_SETTINGS;
    }
  });

  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [highlightedGiftId, setHighlightedGiftId] = useState(null);
  const [spotlightKey, setSpotlightKey] = useState(0);

  const isChroma = typeof window !== 'undefined' && window.location.href.includes('chroma=true');
  const activeMappedGifts = giftMappings.filter((m) => m.enabled);

  // Trigger flash animation on matching gift card
  const triggerGiftFlash = useCallback((identifier) => {
    if (!identifier) return;
    const target = activeMappedGifts.find(
      (m) =>
        String(m.id) === String(identifier) ||
        String(m.giftId) === String(identifier) ||
        String(m.effect).toLowerCase() === String(identifier).toLowerCase() ||
        String(m.giftName).toLowerCase().includes(String(identifier).toLowerCase())
    );
    if (target) {
      setHighlightedGiftId(target.id);
      setTimeout(() => setHighlightedGiftId(null), 3500);
    }
  }, [activeMappedGifts]);

  const handleIncomingPayload = useCallback((data) => {
    if (!data || typeof data !== 'object') return;

    if (data.type === 'ENGINE_CONFIG') {
      if (Array.isArray(data.giftMappings)) {
        setGiftMappings(data.giftMappings);
      }
      if (data.sliderConfig && typeof data.sliderConfig === 'object') {
        setSliderConfig((prev) => ({ ...prev, ...data.sliderConfig }));
      }
    } else if (data.type === 'SHADER') {
      if (data.effect) {
        triggerGiftFlash(data.effect);
      }
    } else if (data.type === 'ALERT' || data.type === 'TRIGGER_HIGHLIGHT') {
      const idOrName = data.giftId || data.giftName || data.effect;
      if (idOrName) {
        triggerGiftFlash(idOrName);
      }
    }
  }, [triggerGiftFlash]);

  // Spotlight rotation timer
  useEffect(() => {
    if (sliderConfig.mode !== 'spotlight' || activeMappedGifts.length <= 1) return;
    const intervalMs = Math.max(3000, Math.round((sliderConfig.speed || 18) * 200));
    const timer = setInterval(() => {
      setSpotlightIndex((i) => (i + 1) % activeMappedGifts.length);
      setSpotlightKey((k) => k + 1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [sliderConfig.mode, sliderConfig.speed, activeMappedGifts.length]);

  // Real-time synchronization listeners
  useEffect(() => {
    document.body.style.backgroundColor = isChroma ? '#00ff00' : 'transparent';
    document.body.style.backgroundImage = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // 1. BroadcastChannel (Same-browser / Popout windows)
    const onBroadcastMsg = (e) => handleIncomingPayload(e.data);
    channel.addEventListener('message', onBroadcastMsg);

    // 2. Electron IPC
    let ipcRenderer = null;
    const onIpcMsg = (_evt, payload) => handleIncomingPayload(payload);
    if (typeof window !== 'undefined' && window.require) {
      try {
        ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.on('overlay:event', onIpcMsg);
      } catch {}
    }

    // 3. Server-Sent Events (SSE) from StreamTroll server
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

    // 3.5. WebSocket connection to local StreamTroll app (ws://127.0.0.1:18923)
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

    // 5. LocalStorage change listener (across tabs)
    const onStorage = (e) => {
      if (e.key === 'stream_troll_slider_config' && e.newValue) {
        try { setSliderConfig((prev) => ({ ...prev, ...JSON.parse(e.newValue) })); } catch {}
      }
      if ((e.key === 'stream_troll_mappings' || e.key === 'stream_troll_gift_mappings') && e.newValue) {
        try { setGiftMappings(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      isUnmounted = true;
      if (ws) {
        try { ws.close(); } catch {}
      }
      if (wsRetry) clearTimeout(wsRetry);
      channel.removeEventListener('message', onBroadcastMsg);
      if (ipcRenderer) {
        try { ipcRenderer.removeListener('overlay:event', onIpcMsg); } catch {}
      }
      sseSources.forEach((es) => {
        try { es.close(); } catch {}
      });
      window.removeEventListener('storage', onStorage);
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
      document.body.style.overflow = '';
    };
  }, [isChroma, handleIncomingPayload]);

  if (!sliderConfig.enabled || activeMappedGifts.length === 0) {
    return (
      <div className="slider-standalone-empty">
        <span style={{ opacity: 0.25, fontSize: '0.85rem' }}>StreamTroll Slider (Esperando regalos mapeados...)</span>
      </div>
    );
  }

  const currentTheme = sliderConfig.theme || 'cyber';
  const spotlightItem = activeMappedGifts[spotlightIndex % activeMappedGifts.length] || activeMappedGifts[0];

  // For seamless marquee loop with translateX(-50%), we build two identical mirrored sets
  const marqueeGroup = [...activeMappedGifts];
  while (marqueeGroup.length < 6) {
    marqueeGroup.push(...activeMappedGifts);
  }
  const marqueeItems = [...marqueeGroup, ...marqueeGroup];

  return (
    <div
      className={`slider-standalone-viewport theme-${currentTheme} mode-${sliderConfig.mode}`}
      style={{
        transform: `scale(${sliderConfig.scale || 1.0})`,
        transformOrigin: 'center center'
      }}
    >
      {/* Optional Left Header Badge */}
      {sliderConfig.showBadge && (
        <div className="slider-standalone-badge">
          <span className="slider-badge-pulse" />
          <span className="slider-badge-text">{sliderConfig.badgeText || '🎁 REGALOS ACTIVOS'}</span>
        </div>
      )}

      {/* MODE 1: MARQUEE CONTINUO (INFINITE TICKER) */}
      {sliderConfig.mode === 'marquee' && (
        <div className="slider-standalone-track-container">
          <div
            className="slider-standalone-track"
            style={{
              gap: `${sliderConfig.gap || 34}px`,
              animationDuration: `${sliderConfig.speed || 18}s`
            }}
          >
            {marqueeItems.map((m, idx) => {
              const isFlashed = highlightedGiftId === m.id;
              const displayName = String(m.customLabel || m.label || m.giftName || 'GIFT').toUpperCase();

              return (
                <div
                  key={`${m.id}-${idx}`}
                  className={`slider-streamer-meme-item ${isFlashed ? 'card-highlight-active' : ''}`}
                >
                  <div className="slider-streamer-icon-wrap">
                    <SliderGiftImage item={m} size={82} />
                  </div>
                  <div className="slider-streamer-meme-text">
                    {displayName}
                  </div>
                  {sliderConfig.showCoins !== false && (
                    <div className="slider-streamer-coins-pill">
                      🪙 {m.minCoins}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: SPOTLIGHT / VITRINA 1 A 1 */}
      {sliderConfig.mode === 'spotlight' && spotlightItem && (
        <div className="slider-spotlight-wrapper">
          {(() => {
            const effMeta = EFFECT_COLORS[spotlightItem.effect] || { border: '#a855f7', badgeBg: 'rgba(168,85,247,0.25)', text: '#e9d5ff', label: spotlightItem.effect?.toUpperCase() };
            const isFlashed = highlightedGiftId === spotlightItem.id;
            const progressDuration = Math.max(3000, Math.round((sliderConfig.speed || 18) * 200));

            return (
              <div
                key={spotlightKey}
                className={`slider-standalone-card spotlight-card-active ${isFlashed ? 'card-highlight-active' : ''}`}
                style={{
                  borderColor: isFlashed ? '#fbbf24' : effMeta.border
                }}
              >
                <div className="slider-card-icon-wrap">
                  <SliderGiftImage item={spotlightItem} size={36} />
                </div>

                <div className="slider-card-body">
                  <span className="slider-card-name" style={{ fontSize: '0.96rem' }}>{spotlightItem.customLabel || spotlightItem.giftName}</span>
                  {sliderConfig.showCoins !== false && (
                    <span className="slider-card-coins">🪙 {spotlightItem.minCoins} monedas</span>
                  )}
                </div>

                <span className="slider-card-arrow" style={{ fontSize: '1.1rem' }}>➔</span>

                {sliderConfig.showEffect !== false && (
                  <div
                    className="slider-card-effect-pill"
                    style={{
                      background: effMeta.badgeBg,
                      borderColor: effMeta.border,
                      color: effMeta.text,
                      fontSize: '0.82rem',
                      padding: '5px 12px'
                    }}
                  >
                    <span className="slider-effect-icon">✨</span>
                    <span>{effMeta.label}</span>
                    {spotlightItem.duration && <span className="slider-duration">({spotlightItem.duration}s)</span>}
                  </div>
                )}

                {spotlightItem.ttsVoice !== false && (
                  <span className="slider-tts-tag">🔊</span>
                )}

                <span className="slider-spotlight-counter">
                  {(spotlightIndex % activeMappedGifts.length) + 1}/{activeMappedGifts.length}
                </span>

                {/* Animated countdown line */}
                <div
                  className="slider-spotlight-progress-line"
                  style={{
                    animationDuration: `${progressDuration}ms`,
                    background: effMeta.border
                  }}
                />
              </div>
            );
          })()}
        </div>
      )}

      {/* MODE 3: STATIC / BARRA FIJA CENTRADA */}
      {sliderConfig.mode === 'static' && (
        <div className="slider-static-row" style={{ gap: `${sliderConfig.gap || 30}px` }}>
          {activeMappedGifts.map((m) => {
            const isFlashed = highlightedGiftId === m.id;
            const displayName = m.customLabel || m.label || m.giftName || 'GIFT';

            return (
              <div
                key={m.id}
                className={`slider-streamer-meme-item ${isFlashed ? 'card-highlight-active' : ''}`}
              >
                <div className="slider-streamer-icon-wrap">
                  <SliderGiftImage item={m} size={82} />
                </div>
                <div className="slider-streamer-meme-text">
                  {displayName}
                </div>
                {sliderConfig.showCoins && (
                  <div className="slider-streamer-coins-pill">
                    🪙 {m.minCoins}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

