const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('src/Dashboard.jsx');
let content = fs.readFileSync(targetPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Add import of regalos.json at the top
const oldTop = `import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

const channel = new BroadcastChannel('stream_troll_channel');`;

const newTop = `import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import regalosData from './regalos.json';

const channel = new BroadcastChannel('stream_troll_channel');`;

if (content.includes(oldTop)) {
  content = content.replace(oldTop, newTop);
  console.log('✓ Added regalos.json import');
} else {
  console.error('✗ Could not find oldTop');
}

// 2. Build TIKTOK_GIFTS_CATALOG using regalosData with full 983 gifts and images
const catalogStartStr = `// TikTok Gifts Catalog Matching Image 1\nconst TIKTOK_GIFTS_CATALOG = [`;
const catalogEndStr = `// TikTok Live Events Catalog\nconst TIKTOK_EVENTS_CATALOG = [`;

const catStartIdx = content.indexOf(catalogStartStr);
const catEndIdx = content.indexOf(catalogEndStr);

if (catStartIdx !== -1 && catEndIdx !== -1) {
  const newCatalogCode = `// TikTok Gifts Catalog with official TikTok images from regalos.json
const TIKTOK_GIFTS_CATALOG = (regalosData && Array.isArray(regalosData.gifts))
  ? regalosData.gifts.map((g) => ({
      id: g.id || g.name,
      giftId: g.id,
      name: g.name,
      coins: Number(g.price) || 1,
      image: g.image,
      icon: (g.name.toLowerCase().includes('rose') || g.name.toLowerCase().includes('rosa')) ? '🌹' :
            (g.name.toLowerCase().includes('lion') || g.name.toLowerCase().includes('leon')) ? '🦁' :
            (g.name.toLowerCase().includes('heart')) ? '💖' :
            (g.name.toLowerCase().includes('money')) ? '🔫' :
            (g.name.toLowerCase().includes('doughnut') || g.name.toLowerCase().includes('donut') || g.name.toLowerCase().includes('dona')) ? '🍩' :
            (g.name.toLowerCase().includes('capybara')) ? '🦫' :
            (g.name.toLowerCase().includes('panda')) ? '🐼' : '🎁'
    }))
  : [];\n\n`;

  content = content.slice(0, catStartIdx) + newCatalogCode + content.slice(catEndIdx);
  console.log('✓ Updated TIKTOK_GIFTS_CATALOG with full 983 official TikTok gifts and images');
} else {
  console.error('✗ Could not find catalog boundaries');
}

// 3. Update DEFAULT_GIFT_MAPPINGS with the user's complete setup
const oldDefaultMappings = `const DEFAULT_GIFT_MAPPINGS = [
  {
    id: 'map-1',
    type: 'gift',
    giftName: 'Rose',
    giftIcon: '🌹',
    minCoins: 1,
    effect: 'drunk',
    duration: 6,
    tts: false,
    enabled: true
  },
  {
    id: 'map-2',
    type: 'gift',
    giftName: 'Panda',
    giftIcon: '🐼',
    minCoins: 199,
    effect: 'gameboy',
    duration: 8,
    tts: true,
    enabled: true
  },
  {
    id: 'map-3',
    type: 'gift',
    giftName: 'León',
    giftIcon: '🦁',
    minCoins: 29999,
    effect: 'flashbang',
    duration: 8,
    tts: true,
    enabled: true
  }
];`;

const newDefaultMappings = `const DEFAULT_GIFT_MAPPINGS = [
  {
    id: 'map-1',
    type: 'gift',
    giftId: 'gift_2',
    giftName: 'Rose',
    customLabel: 'drunk',
    giftIcon: '🌹',
    giftImage: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp',
    minCoins: 1,
    effect: 'drunk',
    duration: 6,
    tts: false,
    enabled: true
  },
  {
    id: 'map-1793996838515',
    type: 'gift',
    giftId: 'gift_26',
    giftName: 'Finger Heart',
    customLabel: 'mirror',
    giftIcon: '🫰',
    giftImage: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/a4c4dc437fd3a6632aba149769491f49.png~tplv-obj.webp',
    minCoins: 5,
    effect: 'mirror',
    duration: 6,
    tts: true,
    enabled: true
  },
  {
    id: 'map-1793996861453',
    type: 'gift',
    giftId: 'gift_307',
    giftName: 'Capybara',
    customLabel: 'flash',
    giftIcon: '🦫',
    giftImage: 'https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/6703facdac34caefbd0617a6321afe9b.png~tplv-obj.webp',
    minCoins: 30,
    effect: 'flashbang',
    duration: 6,
    tts: true,
    enabled: true
  },
  {
    id: 'map-1793996916900',
    type: 'gift',
    giftId: 'gift_152',
    giftName: 'Money Gun',
    customLabel: 'cerrar juego',
    giftIcon: '🔫',
    giftImage: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/e0589e95a2b41970f0f30f6202f5fce6~tplv-obj.webp',
    minCoins: 500,
    effect: 'close_app',
    duration: 6,
    tts: true,
    enabled: true
  },
  {
    id: 'map-1793996959613',
    type: 'gift',
    giftId: 'gift_225',
    giftName: 'Meteor Shower',
    customLabel: 'APAGAR STREAM',
    giftIcon: '☄️',
    giftImage: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/71883933511237f7eaa1bf8cd12ed575~tplv-obj.webp',
    minCoins: 3000,
    effect: 'stop_stream',
    duration: 15,
    tts: true,
    enabled: true
  }
];`;

if (content.includes(oldDefaultMappings)) {
  content = content.replace(oldDefaultMappings, newDefaultMappings);
  console.log('✓ Updated DEFAULT_GIFT_MAPPINGS with 5 complete mappings and images');
} else {
  console.error('✗ Could not find oldDefaultMappings');
}

// 4. Default user session to Migue logged in with ULTIMATE
const oldUserInit = `  // Troll Me / Stream Troll User Auth State (Starts on login screen on every app launch)
  const [trollUser, setTrollUser] = useState({
    isLoggedIn: false,
    email: '',
    username: '',
    plan: 'GRATUITO',
    avatar: '👤'
  });

  const [trollLoginEmail, setTrollLoginEmail] = useState('');
  const [trollLoginPass, setTrollLoginPass] = useState('');`;

const newUserInit = `  // Troll Me / Stream Troll User Auth State (Restores saved session or defaults to Migue logged in)
  const [trollUser, setTrollUser] = useState(() => {
    try {
      const saved = localStorage.getItem('troll_me_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          const isMigue = parsed.email.toLowerCase().trim() === 'miguerodriguez1008@gmail.com';
          return {
            ...parsed,
            isLoggedIn: true,
            plan: isMigue ? 'ULTIMATE' : 'GRATUITO',
            avatar: isMigue ? '👑' : '😎'
          };
        }
      }
    } catch {}
    return {
      isLoggedIn: true,
      email: 'miguerodriguez1008@gmail.com',
      username: 'MigueRodriguez',
      plan: 'ULTIMATE',
      avatar: '👑'
    };
  });

  const [trollLoginEmail, setTrollLoginEmail] = useState('miguerodriguez1008@gmail.com');
  const [trollLoginPass, setTrollLoginPass] = useState('••••••••');`;

if (content.includes(oldUserInit)) {
  content = content.replace(oldUserInit, newUserInit);
  console.log('✓ Updated trollUser initialization to keep Migue logged in by default');
} else {
  console.error('✗ Could not find oldUserInit');
}

// 5. Update mapping card rendering to display giftImage
const oldCardTrigger = `                        <div className="mapping-item-trigger">
                          <div className="mapping-trigger-icon">
                            {m.giftIcon || '🎁'}
                          </div>
                          <div>
                            <div className="mapping-trigger-title">{m.giftName}</div>
                            <div className="mapping-trigger-meta">
                              <span>🪙</span> {m.minCoins} Moneda{m.minCoins > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>`;

const newCardTrigger = `                        <div className="mapping-item-trigger">
                          <div className="mapping-trigger-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {m.giftImage ? (
                              <img src={m.giftImage} alt={m.giftName} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            ) : (
                              <span>{m.giftIcon || '🎁'}</span>
                            )}
                          </div>
                          <div>
                            <div className="mapping-trigger-title">{m.giftName}</div>
                            <div className="mapping-trigger-meta">
                              <span>🪙</span> {m.minCoins} Moneda{m.minCoins > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>`;

if (content.includes(oldCardTrigger)) {
  content = content.replace(oldCardTrigger, newCardTrigger);
  console.log('✓ Updated mapping card rendering with gift images');
} else {
  console.error('✗ Could not find oldCardTrigger');
}

// 6. Update gift modal card to display gift.image
const oldModalGrid = `            <div className="gift-catalog-grid">
              {filteredGifts.map((gift) => (
                <button 
                  key={gift.id}
                  className="gift-card-btn"
                  onClick={() => {
                    setConfiguringTrigger({ type: 'gift', item: gift });
                    setSelectedEffect('drunk');
                    setSelectedDuration(6);
                    setSelectedTts(true);
                  }}
                >
                  <div className="gift-card-sticker">{gift.icon}</div>
                  <div className="gift-card-name" title={gift.name}>{gift.name}</div>
                  <div className="gift-card-price">
                    <span>🪙</span>
                    <span>{gift.coins}</span>
                  </div>
                </button>
              ))}
            </div>`;

const newModalGrid = `            <div className="gift-catalog-grid">
              {filteredGifts.map((gift) => (
                <button 
                  key={gift.id}
                  className="gift-card-btn"
                  onClick={() => {
                    setConfiguringTrigger({
                      type: 'gift',
                      item: {
                        ...gift,
                        giftId: gift.id || gift.giftId,
                        giftImage: gift.image || '',
                        giftIcon: gift.icon || '🎁'
                      }
                    });
                    setSelectedEffect('drunk');
                    setSelectedDuration(6);
                    setSelectedTts(true);
                  }}
                >
                  <div className="gift-card-sticker" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {gift.image ? (
                      <img src={gift.image} alt={gift.name} style={{ width: '44px', height: '44px', objectFit: 'contain' }} loading="lazy" />
                    ) : (
                      <span>{gift.icon}</span>
                    )}
                  </div>
                  <div className="gift-card-name" title={gift.name}>{gift.name}</div>
                  <div className="gift-card-price">
                    <span>🪙</span>
                    <span>{gift.coins}</span>
                  </div>
                </button>
              ))}
            </div>`;

if (content.includes(oldModalGrid)) {
  content = content.replace(oldModalGrid, newModalGrid);
  console.log('✓ Updated gift catalog modal grid to display official webp images');
} else {
  console.error('✗ Could not find oldModalGrid');
}

// 7. Update configuringTrigger modal icon to display image
const oldConfigIcon = `              <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>
                {configuringTrigger.item.icon}
              </div>`;

const newConfigIcon = `              <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center' }}>
                {configuringTrigger.item.image || configuringTrigger.item.giftImage ? (
                  <img src={configuringTrigger.item.image || configuringTrigger.item.giftImage} alt="" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                ) : (
                  <span>{configuringTrigger.item.icon || '🎁'}</span>
                )}
              </div>`;

if (content.includes(oldConfigIcon)) {
  content = content.replace(oldConfigIcon, newConfigIcon);
  console.log('✓ Updated configuringTrigger modal icon with image');
} else {
  console.error('✗ Could not find oldConfigIcon');
}

// 8. Update saveNewMapping to persist giftImage
const oldSaveNew = `      const gift = configuringTrigger.item;
      const newMapping = {
        id: \`map-\${Date.now()}\`,
        type: 'gift',
        giftId: gift.id,
        giftName: gift.name,
        giftIcon: gift.icon,
        minCoins: gift.coins,
        effect: selectedEffect,
        duration: selectedDuration,
        tts: selectedTts,
        enabled: true
      };`;

const newSaveNew = `      const gift = configuringTrigger.item;
      const newMapping = {
        id: \`map-\${Date.now()}\`,
        type: 'gift',
        giftId: gift.id || gift.giftId,
        giftName: gift.name,
        giftIcon: gift.icon || '🎁',
        giftImage: gift.image || gift.giftImage || '',
        minCoins: gift.coins || gift.price || 1,
        effect: selectedEffect,
        duration: selectedDuration,
        tts: selectedTts,
        enabled: true
      };`;

if (content.includes(oldSaveNew)) {
  content = content.replace(oldSaveNew, newSaveNew);
  console.log('✓ Updated saveNewMapping to include giftImage');
} else {
  console.error('✗ Could not find oldSaveNew');
}

// 9. Update loadFromDisk to restore trollUser
const oldLoadFromDisk = `          if (loaded.timerConfig) {
            setTimerConfig((prev) => ({ ...prev, ...loaded.timerConfig }));
          }`;

const newLoadFromDisk = `          if (loaded.timerConfig) {
            setTimerConfig((prev) => ({ ...prev, ...loaded.timerConfig }));
          }
          if (loaded.trollUser && loaded.trollUser.email) {
            const isMigue = loaded.trollUser.email.toLowerCase().trim() === 'miguerodriguez1008@gmail.com';
            setTrollUser({
              ...loaded.trollUser,
              isLoggedIn: true,
              plan: isMigue ? 'ULTIMATE' : 'GRATUITO',
              avatar: isMigue ? '👑' : '😎'
            });
          }`;

if (content.includes(oldLoadFromDisk)) {
  content = content.replace(oldLoadFromDisk, newLoadFromDisk);
  console.log('✓ Updated loadFromDisk to restore trollUser from persistent config');
} else {
  console.error('✗ Could not find oldLoadFromDisk');
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Finished writing Dashboard.jsx! New length:', content.length);

