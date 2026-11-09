import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import regalosData from './regalos.json';

const channel = new BroadcastChannel('stream_troll_channel');

const TRANSLATIONS = {
  es: {
    // Sidebar
    dashboard: 'Panel Principal',
    mappings: 'Mapeos de Regalos',
    slider: 'Slider de Regalos (OBS)',
    tips: 'Propinas y Donaciones',
    contests: 'Sorteos y Concursos',
    chatbot: 'Chatbot',
    giftGraphics: 'Gráficos de Regalos',
    timer: 'Temporizador Subatón',
    plans: 'Planes (Free vs Pro)',
    shaders: 'Shaders y Efectos',
    soundboard: 'Soundboard (Sonidos)',
    overlay: 'Overlay (OBS Studio)',
    support: 'Soporte y Ayuda',
    logout: 'Cerrar Sesión',
    loginTrollMe: 'Iniciar Sesión',
    badgeNew: 'NUEVO',
    badgeSoon: 'PRONTO',
    badgeObs: 'OBS',
    badgePro: 'PRO',

    // Header & Top Bar
    newTipsTitle: 'Propinas y Donaciones',
    newTipsSub: 'Recibe dinero de seguidores fuera de TikTok',
    activate: 'Activar',
    guideWarningPre: 'Para mostrar efectos a los espectadores: Sigue todos los pasos en la',
    streamerGuide: 'Guía del Streamer',
    connectTiktok: 'Conectar TikTok',
    connected: 'Conectado',
    disconnected: 'Desconectado',

    // Dashboard View
    screenSelection: 'Selección de Pantalla',
    screenSelectionSub: 'Selecciona qué monitor será capturado y procesado por los efectos',
    refresh: 'Actualizar',
    graphicsEngine: 'Motor Gráfico',
    ultraGamingMode: 'Modo Ultra FPS Gaming (Zero Lag)',
    desktopOverlayLabel: 'Superposición en Escritorio',
    alignmentGrid: 'Cuadrícula de Alineación',
    giftsReceived: 'Regalos Recibidos',
    actionsExecuted: 'Acciones Ejecutadas',
    queueLength: 'Cola en Espera',
    quickTesterTitle: 'Probador Rápido de Regalos y Eventos',
    quickTesterSub: 'Simula regalos o eventos para ver cómo se activan tus mapeos en OBS',
    recentActionsTitle: 'ÚLTIMAS ACCIONES PROCESADAS',
    noRule: 'Sin regla',
    on: 'ACTIVADO',
    off: 'DESACTIVADO',
    sent: 'envió',

    // Mappings View
    mappingsTitle: 'Mapeos de Acciones',
    mappingsSub: 'Mapea regalos y eventos de TikTok Live a efectos visuales y del sistema',
    giftsTab: 'Regalos',
    eventsTab: 'Eventos',
    giftsSubText: 'Configura qué efectos se activan cuando recibes regalos específicos o por umbral de monedas',
    eventsSubText: 'Configura qué efectos se activan con eventos de TikTok Live (Follow, Share, Likes, etc.)',
    addMapping: '+ Agregar Mapeo',
    byCoins: '+ Por Monedas',
    combosLabel: 'Combos:',
    comboStreakEnd: 'Esperar final de racha (Recomendado)',
    comboEveryGift: 'Ejecutar cada regalo individual',
    sliderPanelTitle: 'Slider de Regalos Mapeados (OBS Overlay)',
    sliderPanelSub: 'Espacio dedicado con carrusel animado para que tus espectadores vean qué regalo activa cada efecto',
    activeInOBS: 'ACTIVO EN OBS',
    hiddenInOBS: 'OCULTO',
    searchPlaceholder: 'Buscar regalo por nombre o monedas...',
    searchEventsPlaceholder: 'Buscar evento...',
    renameBtn: '✏️ Renombrar',
    saveBtn: 'Guardar',
    cancelBtn: 'Cancelar',
    deleteBtn: 'Eliminar',
    testBtn: '▶ Probar',
    coinsLabel: 'monedas',
    durationLabel: 'segundos',

    // Timer View
    timerTitle: '⏱️ Extensible Timer (Subatón)',
    timerSub: 'Temporizador automático que suma tiempo con cada regalo o donación de tus espectadores',
    timerRunning: '🟢 Cuenta regresiva en marcha',
    timerPaused: '⏸️ Temporizador en pausa',
    timerStart: '▶ Iniciar Cuenta',
    timerPause: '⏸️ Pausar',
    timerReset: '🔄 Reiniciar',
    timerAddMin: '+5 Min',
    timerSubMin: '-5 Min',

    // Modals
    guideModalTitle: 'Guía Rápida para Streamers',
    guideModalSub: 'Sigue estos 4 pasos para mostrar los efectos y shaders a tus espectadores en tiempo real:',
    guideStep1Title: 'Paso 1: Iniciar Sesión en TikTok y Stream Troll',
    guideStep1Desc: 'Haz clic en el botón "Conectar TikTok" arriba a la derecha e ingresa tu usuario para escuchar regalos.',
    guideStep2Title: 'Paso 2: Elegir tu Pantalla de Captura',
    guideStep2Desc: 'Selecciona la pantalla donde juegas para que el motor gráfico aplique los shaders.',
    guideStep3Title: 'Paso 3: Agregar la fuente de Navegador en OBS',
    guideStep3Desc: 'Copia el enlace del Overlay o del Slider e ingrésalo como Navegador en OBS Studio.',
    guideStep4Title: 'Paso 4: ¡Disfrutar el Stream!',
    guideStep4Desc: 'Cada vez que recibas un regalo, el shader y los sonidos se activarán automáticamente.',
    guideCloseBtn: '¡Entendido, vamos a transmitir! 🚀',

    tiktokModalTitle: 'Iniciar Sesión en TikTok',
    tiktokModalSub: 'Conecta tu cuenta de TikTok para recibir eventos de tus directos en tiempo real',
    tiktokOfficialTitle: '🌐 Conexión oficial de Streamer',
    openOfficialTiktok: 'Abrir ventana oficial de TikTok Login',
    tiktokOfficialNote: 'Abre la ventana oficial segura para escanear código QR o ingresar con contraseña',
    tiktokLiveLabel: '🎯 Conexión a Directo de TikTok en Vivo',
    tiktokConnectBtn: 'Conectar',
    tiktokDisconnectBtn: 'Desconectar',
    tiktokConnectingBtn: 'Conectando...',
    orUseOptions: 'O inicia sesión con tu método preferido:'
  },
  en: {
    // Sidebar
    dashboard: 'Dashboard',
    mappings: 'Gift Mappings',
    slider: 'OBS Gift Slider',
    tips: 'Tips & Donations',
    contests: 'Raffles & Contests',
    chatbot: 'Chatbot',
    giftGraphics: 'Gift Graphics',
    timer: 'Extensible Timer',
    plans: 'Plans (Free vs Pro)',
    shaders: 'Shaders & Effects',
    soundboard: 'Soundboard',
    overlay: 'OBS Studio Overlay',
    support: 'Support & Help',
    logout: 'Log Out',
    loginTrollMe: 'Log In',
    badgeNew: 'NEW',
    badgeSoon: 'SOON',
    badgeObs: 'OBS',
    badgePro: 'PRO',

    // Header & Top Bar
    newTipsTitle: 'Tips & Donations',
    newTipsSub: 'Receive money from fans outside TikTok',
    activate: 'Activate',
    guideWarningPre: 'To show effects to viewers: Follow all steps in the',
    streamerGuide: 'Streamer Guide',
    connectTiktok: 'Connect TikTok',
    connected: 'Connected',
    disconnected: 'Disconnected',

    // Dashboard View
    screenSelection: 'Screen Selection',
    screenSelectionSub: 'Select which monitor will be captured and processed by the effects',
    refresh: 'Refresh',
    graphicsEngine: 'Graphics Engine',
    ultraGamingMode: 'Ultra Gaming FPS Mode (Zero Lag)',
    desktopOverlayLabel: 'Desktop Overlay',
    alignmentGrid: 'Alignment Grid',
    giftsReceived: 'Gifts Received',
    actionsExecuted: 'Actions Executed',
    queueLength: 'Queue Length',
    quickTesterTitle: 'Quick Gifts & Events Tester',
    quickTesterSub: 'Simulate gifts or events to test how mappings trigger in OBS',
    recentActionsTitle: 'RECENT PROCESSED ACTIONS',
    noRule: 'No rule',
    on: 'ON',
    off: 'OFF',
    sent: 'sent',

    // Mappings View
    mappingsTitle: 'Action Mappings',
    mappingsSub: 'Map TikTok Live gifts and events to visual shaders and system actions',
    giftsTab: 'Gifts',
    eventsTab: 'Events',
    giftsSubText: 'Configure which effects trigger when you receive specific gifts or coin thresholds',
    eventsSubText: 'Configure which effects trigger with TikTok Live events (Follow, Share, Likes, etc.)',
    addMapping: '+ Add Mapping',
    byCoins: '+ By Coins',
    combosLabel: 'Combos:',
    comboStreakEnd: 'Wait for streak end (Recommended)',
    comboEveryGift: 'Trigger on every single gift',
    sliderPanelTitle: 'Mapped Gifts Slider (OBS Overlay)',
    sliderPanelSub: 'Dedicated space with animated carousel so your viewers see which gift triggers each effect',
    activeInOBS: 'ACTIVE IN OBS',
    hiddenInOBS: 'HIDDEN',
    searchPlaceholder: 'Search gift by name or coins...',
    searchEventsPlaceholder: 'Search event...',
    renameBtn: '✏️ Rename',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',
    deleteBtn: 'Delete',
    testBtn: '▶ Test',
    coinsLabel: 'coins',
    durationLabel: 'seconds',

    // Timer View
    timerTitle: '⏱️ Extensible Timer (Subathon)',
    timerSub: 'Automatic countdown timer that adds time with every gift or donation from your viewers',
    timerRunning: '🟢 Countdown in progress',
    timerPaused: '⏸️ Timer paused',
    timerStart: '▶ Start Timer',
    timerPause: '⏸️ Pause',
    timerReset: '🔄 Reset',
    timerAddMin: '+5 Min',
    timerSubMin: '-5 Min',

    // Modals
    guideModalTitle: 'Quick Streamer Guide',
    guideModalSub: 'Follow these 4 steps to broadcast effects and shaders to your viewers in real time:',
    guideStep1Title: 'Step 1: Log in to TikTok & Stream Troll',
    guideStep1Desc: 'Click "Connect TikTok" at top right and enter your username to listen for gifts.',
    guideStep2Title: 'Step 2: Choose your Capture Screen',
    guideStep2Desc: 'Select the screen where your game runs so the graphics engine applies shaders.',
    guideStep3Title: 'Step 3: Add Browser Source in OBS',
    guideStep3Desc: 'Copy the Overlay or Slider link and paste it into a Browser Source in OBS Studio.',
    guideStep4Title: 'Step 4: Enjoy your Stream!',
    guideStep4Desc: 'Every time a viewer sends a gift, shaders and sounds will trigger automatically.',
    guideCloseBtn: 'Understood, let’s stream! 🚀',

    tiktokModalTitle: 'Log in to TikTok',
    tiktokModalSub: 'Connect your TikTok account to receive live stream events in real time',
    tiktokOfficialTitle: '🌐 Official Streamer Connection',
    openOfficialTiktok: 'Open Official TikTok Login Window',
    tiktokOfficialNote: 'Opens the safe official window to scan QR code or enter credentials',
    tiktokLiveLabel: '🎯 Connect to Live TikTok Stream',
    tiktokConnectBtn: 'Connect',
    tiktokDisconnectBtn: 'Disconnect',
    tiktokConnectingBtn: 'Connecting...',
    orUseOptions: 'Or log in with your preferred method:'
  },
  pt: {
    // Sidebar
    dashboard: 'Painel Principal',
    mappings: 'Mapeamento de Presentes',
    slider: 'Carrossel de Presentes (OBS)',
    tips: 'Gorjetas e Doações',
    contests: 'Sorteios e Concursos',
    chatbot: 'Chatbot',
    giftGraphics: 'Gráficos de Presentes',
    timer: 'Temporizador Subatona',
    plans: 'Planos (Free vs Pro)',
    shaders: 'Shaders e Efeitos',
    soundboard: 'Mesa de Som',
    overlay: 'Overlay (OBS Studio)',
    support: 'Suporte e Ajuda',
    logout: 'Sair',
    loginTrollMe: 'Entrar',
    badgeNew: 'NOVO',
    badgeSoon: 'EM BREVE',
    badgeObs: 'OBS',
    badgePro: 'PRO',

    // Header & Top Bar
    newTipsTitle: 'Gorjetas e Doações',
    newTipsSub: 'Receba dinheiro dos fãs fora do TikTok',
    activate: 'Ativar',
    guideWarningPre: 'Para mostrar efeitos aos espectadores: Siga todas as etapas no',
    streamerGuide: 'Guia do Streamer',
    connectTiktok: 'Conectar TikTok',
    connected: 'Conectado',
    disconnected: 'Desconectado',

    // Dashboard View
    screenSelection: 'Seleção de Tela',
    screenSelectionSub: 'Selecione qual monitor será capturado e processado pelos efeitos',
    refresh: 'Atualizar',
    graphicsEngine: 'Motor Gráfico',
    ultraGamingMode: 'Modo Ultra FPS Gaming (Zero Lag)',
    desktopOverlayLabel: 'Sobreposição de Tela',
    alignmentGrid: 'Grade de Alinhamento',
    giftsReceived: 'Presentes Recebidos',
    actionsExecuted: 'Ações Executadas',
    queueLength: 'Fila de Espera',
    quickTesterTitle: 'Testador Rápido de Presentes e Eventos',
    quickTesterSub: 'Simule presentes ou eventos para ver como disparam no OBS',
    recentActionsTitle: 'ÚLTIMAS AÇÕES PROCESSADAS',
    noRule: 'Sem regra',
    on: 'LIGADO',
    off: 'DESLIGADO',
    sent: 'enviou',

    // Mappings View
    mappingsTitle: 'Mapeamento de Ações',
    mappingsSub: 'Mapeie presentes e eventos do TikTok Live para shaders e ações do sistema',
    giftsTab: 'Presentes',
    eventsTab: 'Eventos',
    giftsSubText: 'Configure quais efeitos são ativados com presentes específicos ou por moedas',
    eventsSubText: 'Configure quais efeitos são ativados com eventos do TikTok Live (Follow, Share, etc.)',
    addMapping: '+ Adicionar Mapeamento',
    byCoins: '+ Por Moedas',
    combosLabel: 'Combos:',
    comboStreakEnd: 'Aguardar fim do combo (Recomendado)',
    comboEveryGift: 'Disparar a cada presente individual',
    sliderPanelTitle: 'Carrossel de Presentes Mapeados (OBS Overlay)',
    sliderPanelSub: 'Espaço com carrossel animado para que seu público veja o efeito de cada presente',
    activeInOBS: 'ATIVO NO OBS',
    hiddenInOBS: 'OCULTO',
    searchPlaceholder: 'Buscar presente por nome ou moedas...',
    searchEventsPlaceholder: 'Buscar evento...',
    renameBtn: '✏️ Renomear',
    saveBtn: 'Salvar',
    cancelBtn: 'Cancelar',
    deleteBtn: 'Excluir',
    testBtn: '▶ Testar',
    coinsLabel: 'moedas',
    durationLabel: 'segundos',

    // Timer View
    timerTitle: '⏱️ Temporizador Extensível (Subatona)',
    timerSub: 'Contagem regressiva que adiciona tempo a cada presente ou doação',
    timerRunning: '🟢 Contagem regressiva ativa',
    timerPaused: '⏸️ Temporizador pausado',
    timerStart: '▶ Iniciar Contagem',
    timerPause: '⏸️ Pausar',
    timerReset: '🔄 Reiniciar',
    timerAddMin: '+5 Min',
    timerSubMin: '-5 Min',

    // Modals
    guideModalTitle: 'Guia Rápido do Streamer',
    guideModalSub: 'Siga estas 4 etapas para transmitir shaders e efeitos em tempo real:',
    guideStep1Title: 'Etapa 1: Conectar TikTok e Stream Troll',
    guideStep1Desc: 'Clique em "Conectar TikTok" no canto superior direito e insira seu usuário.',
    guideStep2Title: 'Etapa 2: Escolha sua Tela de Captura',
    guideStep2Desc: 'Selecione a tela onde seu jogo roda para que o motor gráfico aplique os efeitos.',
    guideStep3Title: 'Etapa 3: Adicionar Fonte de Navegador no OBS',
    guideStep3Desc: 'Copie o link do Overlay ou Carrossel e cole na fonte de Navegador no OBS Studio.',
    guideStep4Title: 'Etapa 4: Aproveite sua Live!',
    guideStep4Desc: 'Sempre que receber um presente, os shaders e sons serão disparados automaticamente.',
    guideCloseBtn: 'Entendido, vamos transmitir! 🚀',

    tiktokModalTitle: 'Entrar no TikTok',
    tiktokModalSub: 'Conecte sua conta do TikTok para receber eventos da live em tempo real',
    tiktokOfficialTitle: '🌐 Conexão Oficial de Streamer',
    openOfficialTiktok: 'Abrir janela oficial de login do TikTok',
    tiktokOfficialNote: 'Abre a janela oficial segura para escanear código QR ou entrar com senha',
    tiktokLiveLabel: '🎯 Conectar a Live do TikTok',
    tiktokConnectBtn: 'Conectar',
    tiktokDisconnectBtn: 'Desconectar',
    tiktokConnectingBtn: 'Conectando...',
    orUseOptions: 'Ou entre com seu método preferido:'
  }
};

const AVAILABLE_EFFECTS = [
  { id: 'drunk', name: '🥴 Drunk (Mareo)', free: true },
  { id: 'mirror', name: '🪞 Mirror / Flip', free: true },
  { id: 'blur', name: '👓 Blur (Miopía)', free: true },
  { id: 'glitch', name: '👾 Glitch Retro', free: false },
  { id: 'flashbang', name: '💥 Flashbang (Cegador)', free: false },
  { id: 'gameboy', name: '🟩 Game Boy', free: false },
  { id: 'invert', name: '☯️ Invert (Colores)', free: false },
  { id: 'earthquake', name: '🌋 Earthquake (Temblor)', free: false },
  { id: 'vintage', name: '🎞️ Sepia Vintage', free: false },
];

// Normalization Helper for gift names (removes accents, punctuation, spaces, lowercase)
export const normalizeGiftText = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents (é -> e, ã -> a, etc.)
    .replace(/[^a-z0-9]/g, '')       // remove punctuation and spaces
    .trim();
};

// Multilingual synonym clusters for TikTok gifts across languages (ES, EN, PT, IT)
export const GIFT_SYNONYM_CLUSTERS = [
  { key: 'rose', aliases: ['rose', 'rosa', 'roses', 'rosas', 'redrose', 'whiterose', 'flor'], icon: '🌹' },
  { key: 'panda', aliases: ['panda', 'osopanda', 'ursopanda', 'pandabear'], icon: '🐼' },
  { key: 'lion', aliases: ['lion', 'leon', 'leao', 'leaozinho', 'reyleon'], icon: '🦁' },
  { key: 'doughnut', aliases: ['doughnut', 'donut', 'dona', 'donas', 'rosquilla'], icon: '🍩' },
  { key: 'icecream', aliases: ['icecream', 'icecreamcone', 'conohelado', 'helado', 'sorvete', 'casquinha'], icon: '🍦' },
  { key: 'heart', aliases: ['heart', 'corazon', 'coracao', 'redheart'], icon: '❤️' },
  { key: 'heartme', aliases: ['heartme', 'corazonparami', 'coracaoparamim'], icon: '💖' },
  { key: 'fireworks', aliases: ['fireworks', 'fuegosartificiales', 'fogosartificio', 'fogosdeartificio', 'cuetes'], icon: '🎆' },
  { key: 'rocket', aliases: ['rocket', 'cohete', 'coheteespacial', 'foguete'], icon: '🚀' },
  { key: 'sportscar', aliases: ['sportscar', 'autodeportivo', 'cochedeportivo', 'carroesportivo', 'ferrari'], icon: '🏎️' },
  { key: 'crown', aliases: ['crown', 'corona', 'coroa'], icon: '👑' },
  { key: 'swan', aliases: ['swan', 'cisne'], icon: '🦢' },
  { key: 'universe', aliases: ['universe', 'universo'], icon: '🌌' },
  { key: 'whale', aliases: ['whale', 'ballena', 'baleia'], icon: '🐋' },
  { key: 'chili', aliases: ['chili', 'aji', 'chile', 'pimiento', 'pimenta'], icon: '🌶️' },
  { key: 'corn', aliases: ['corn', 'itscorn', 'maiz', 'choclo', 'elote', 'milho'], icon: '🌽' },
  { key: 'goat', aliases: ['goat', 'cabra'], icon: '🐐' },
  { key: 'cakeslice', aliases: ['cakeslice', 'cake', 'pastel', 'torta', 'bolo', 'rebanada'], icon: '🍰' },
  { key: 'lightning', aliases: ['lightning', 'lightningbolt', 'rayo', 'relampago'], icon: '⚡' },
  { key: 'fingerheart', aliases: ['fingerheart', 'dedocorazon'], icon: '🫰' },
  { key: 'cap', aliases: ['capandmoustache', 'capandmustache', 'gorraybigote', 'gorra', 'bone'], icon: '🧢' },
  { key: 'moneygun', aliases: ['moneygun', 'pistoladedinero', 'armadedinheiro'], icon: '🔫' },
  { key: 'confetti', aliases: ['confetti', 'confeti'], icon: '🎊' },
  { key: 'coffee', aliases: ['coffee', 'cafe'], icon: '☕' },
  { key: 'gg', aliases: ['gg', 'goodgame', 'buenjuego'], icon: '🎮' },
  { key: 'awesome', aliases: ['youreawesome', 'awesome', 'eresincreible', 'increible'], icon: '🐱' },
  { key: 'loveyou', aliases: ['loveyou', 'tequiero', 'teamo', 'love'], icon: '💝' },
  { key: 'dolphin', aliases: ['dolphin', 'delfin', 'golfinho'], icon: '🐬' },
  { key: 'banana', aliases: ['banana', 'platano'], icon: '🍌' }
];

// Robust Matcher: checks giftId, direct normalized text match, or synonym clusters
export const isGiftNameMatch = (incomingName, targetName, incomingGiftId = null, targetGiftId = null) => {
  if (incomingGiftId && targetGiftId && String(incomingGiftId) === String(targetGiftId)) {
    return true;
  }

  const normIn = normalizeGiftText(incomingName);
  const normTarget = normalizeGiftText(targetName);

  if (!normIn || !normTarget) return false;

  // 1. Direct exact or substring match
  if (normIn === normTarget || normIn.includes(normTarget) || normTarget.includes(normIn)) {
    return true;
  }

  // 2. Multilingual synonym cluster match
  for (const cluster of GIFT_SYNONYM_CLUSTERS) {
    const inCluster = cluster.aliases.some((a) => normIn === a || normIn.includes(a) || a.includes(normIn));
    const targetInCluster = cluster.aliases.some((a) => normTarget === a || normTarget.includes(a) || a.includes(normTarget));
    if (inCluster && targetInCluster) {
      return true;
    }
  }

  return false;
};

// TikTok Gifts Catalog with official TikTok images from regalos.json
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
  : [];

// TikTok Live Events Catalog
const TIKTOK_EVENTS_CATALOG = [
  { id: 'follow', name: 'Nuevo Seguidor (Follow)', icon: '👤', description: 'Se activa cuando un nuevo espectador te sigue' },
  { id: 'share', name: 'Compartir Directo (Share)', icon: '🔄', description: 'Se activa cuando alguien comparte tu transmisión' },
  { id: 'likes', name: 'Combo de Likes (100 Likes)', icon: '❤️', description: 'Se activa cada vez que se acumulan 100 likes en el directo' },
  { id: 'sub', name: 'Nueva Suscripción (Sub)', icon: '⭐', description: 'Se activa cuando alguien se suscribe o hace miembro' },
  { id: 'chat', name: 'Palabra Clave en Chat', icon: '💬', description: 'Se activa al escribir "!troll" u otra palabra en el chat' }
];

const DEFAULT_GIFT_MAPPINGS = [
  {
    id: 'map-1',
    type: 'gift',
    giftId: 'gift_2',
    giftName: 'Rose',
    customLabel: 'DRUNK',
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
    customLabel: 'MIRROR',
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
    customLabel: 'PEDRO SONG',
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
    customLabel: 'CERRAR JUEGO',
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
];

const DEFAULT_EVENT_MAPPINGS = [
  {
    id: 'evt-1',
    eventType: 'follow',
    eventName: 'Nuevo Seguidor (Follow)',
    icon: '👤',
    effect: 'glitch',
    duration: 5,
    tts: true,
    enabled: true
  },
  {
    id: 'evt-2',
    eventType: 'share',
    eventName: 'Compartir Directo (Share)',
    icon: '🔄',
    effect: 'mirror',
    duration: 6,
    tts: true,
    enabled: true
  }
];

export const DEFAULT_GIFT_GRAPHICS = [
  {
    id: 'gg-1',
    name: 'Lluvia de Rosas 3D',
    triggerGift: 'Rose',
    triggerCoins: 1,
    icon: '🌹',
    image: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp',
    animationType: 'rain',
    particleCount: 25,
    duration: 5,
    sound: 'pop',
    enabled: true
  },
  {
    id: 'gg-2',
    name: 'Rugido del León Épico',
    triggerGift: 'Lion',
    triggerCoins: 29999,
    icon: '🦁',
    image: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4fb89af2082a290b37d704e20f4fe729~tplv-obj.webp',
    animationType: 'epic',
    particleCount: 30,
    duration: 6,
    sound: 'epic',
    enabled: true
  },
  {
    id: 'gg-3',
    name: 'Lluvia de Donas Glaseadas',
    triggerGift: 'Doughnut',
    triggerCoins: 30,
    icon: '🍩',
    image: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/4e7ad6bdf0a1d860c538f38026d4e812~tplv-obj.webp',
    animationType: 'rain',
    particleCount: 22,
    duration: 5,
    sound: 'pop',
    enabled: true
  },
  {
    id: 'gg-4',
    name: 'Despegue de Cohete Espacial',
    triggerGift: 'Rocket',
    triggerCoins: 1000,
    icon: '🚀',
    image: 'https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/9010f37d363768b5982e5b7e23114d72.png~tplv-obj.webp',
    animationType: 'rocket',
    particleCount: 1,
    duration: 5,
    sound: 'laser',
    enabled: true
  },
  {
    id: 'gg-5',
    name: 'Estallido de Corazones VIP',
    triggerGift: 'Heart',
    triggerCoins: 10,
    icon: '💖',
    image: 'https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/3aa19302bf376f926ad5523992b861fe.png~tplv-obj.webp',
    animationType: 'burst',
    particleCount: 30,
    duration: 4,
    sound: 'coin',
    enabled: true
  }
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState(() => localStorage.getItem('troll_me_lang') || 'es');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  // Troll Me / Stream Troll User Auth State (Restores saved session if logged in, otherwise requires login)
  const [trollUser, setTrollUser] = useState(() => {
    try {
      const saved = localStorage.getItem('troll_me_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.isLoggedIn) {
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
      isLoggedIn: false,
      email: '',
      username: '',
      plan: 'GRATUITO',
      avatar: '👤'
    };
  });

  const [trollLoginEmail, setTrollLoginEmail] = useState('');
  const [trollLoginPass, setTrollLoginPass] = useState('');
  const [showTrollMeLoginModal, setShowTrollMeLoginModal] = useState(false);
  const [showTikTokModal, setShowTikTokModal] = useState(false);
  const [showStreamerGuideModal, setShowStreamerGuideModal] = useState(false);

  // Mappings View State (Image 2: Regalos vs Eventos)
  const [mappingSubTab, setMappingSubTab] = useState('gifts'); // 'gifts' | 'events'
  
  const [giftMappings, setGiftMappings] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_mappings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_GIFT_MAPPINGS;
    } catch {
      return DEFAULT_GIFT_MAPPINGS;
    }
  });

  const [eventMappings, setEventMappings] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_event_mappings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_EVENT_MAPPINGS;
    } catch {
      return DEFAULT_EVENT_MAPPINGS;
    }
  });

  // Gift Graphics State (On-Screen 3D Animations & Falling Rain)
  const [giftGraphics, setGiftGraphics] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_gift_graphics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_GIFT_GRAPHICS;
    } catch {
      return DEFAULT_GIFT_GRAPHICS;
    }
  });

  const [showGraphicModal, setShowGraphicModal] = useState(false);
  const [editingGraphic, setEditingGraphic] = useState(null); // null if creating, graphic object if editing
  const [graphicFormName, setGraphicFormName] = useState('');
  const [graphicFormTriggerGift, setGraphicFormTriggerGift] = useState('Rose');
  const [graphicFormTriggerCoins, setGraphicFormTriggerCoins] = useState(1);
  const [graphicFormIcon, setGraphicFormIcon] = useState('🌹');
  const [graphicFormImage, setGraphicFormImage] = useState('');
  const [graphicFormAnimType, setGraphicFormAnimType] = useState('rain');
  const [graphicFormParticleCount, setGraphicFormParticleCount] = useState(25);
  const [graphicFormDuration, setGraphicFormDuration] = useState(5);
  const [graphicFormSound, setGraphicFormSound] = useState('pop');
  const [graphicCatalogSearch, setGraphicCatalogSearch] = useState('');

  // Modals for Trigger Selection (Image 1)
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [configuringTrigger, setConfiguringTrigger] = useState(null); // { type: 'gift'|'event', item }

  // Gift catalog filters
  const [giftSearch, setGiftSearch] = useState('');
  const [giftCoinFilter, setGiftCoinFilter] = useState('all');
  const [giftSortBy, setGiftSortBy] = useState('low-to-high');

  // Trigger effect form configuration
  const [selectedEffect, setSelectedEffect] = useState('drunk');
  const [selectedDuration, setSelectedDuration] = useState(6);
  const [selectedTts, setSelectedTts] = useState(true);
  const [selectedMinCoins, setSelectedMinCoins] = useState(100);

  // Combo execution mode: 'streak_end' (wait until combo finishes, recommended) vs 'every_gift'
  const [comboMode, setComboMode] = useState(() => {
    try {
      return localStorage.getItem('stream_troll_combo_mode') || 'streak_end';
    } catch {
      return 'streak_end';
    }
  });
  const pendingCombosRef = useRef({});

  const handleSetComboMode = (mode) => {
    setComboMode(mode);
    try {
      localStorage.setItem('stream_troll_combo_mode', mode);
    } catch {}
  };

  // Inline Rename state for Mapped Gifts (sets the name that appears on the OBS streamer slider)
  const [editingMappingId, setEditingMappingId] = useState(null);
  const [editingLabelText, setEditingLabelText] = useState('');
  const [selectedCustomLabel, setSelectedCustomLabel] = useState('');

  const startEditingMapping = (mapping) => {
    setEditingMappingId(mapping.id);
    setEditingLabelText(mapping.customLabel || mapping.giftName || '');
  };

  const cancelEditingMapping = () => {
    setEditingMappingId(null);
    setEditingLabelText('');
  };

  const saveEditingMapping = (mappingId) => {
    const trimmed = (editingLabelText || '').trim();
    setGiftMappings((prev) => {
      const updated = prev.map((m) => {
        if (m.id === mappingId) {
          return {
            ...m,
            customLabel: trimmed || m.giftName
          };
        }
        return m;
      });
      try {
        localStorage.setItem('stream_troll_mappings', JSON.stringify(updated));
        localStorage.setItem('stream_troll_gift_mappings', JSON.stringify(updated));
      } catch {}
      persistConfigToDisk({ giftMappings: updated });
      try {
        channel.postMessage({ type: 'ENGINE_CONFIG', giftMappings: updated });
      } catch {}
      dispatchToOverlay({ type: 'ENGINE_CONFIG', giftMappings: updated });
      return updated;
    });
    setEditingMappingId(null);
    setEditingLabelText('');
    showToast(`✅ Nombre en slider actualizado: "${trimmed || 'Por defecto'}"`);
  };

  // TikTok Live Connection State
  const [tiktokUser, setTiktokUser] = useState('@streamer');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Dashboard Controls & Hardware State
  const [graphicsEngine, setGraphicsEngine] = useState(true);
  const [alignmentGrid, setAlignmentGrid] = useState(false);
  const [ultraPerformanceMode, setUltraPerformanceMode] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_ultra_perf');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [desktopOverlayActive, setDesktopOverlayActive] = useState(true);

  const handleToggleDesktopOverlay = (enabled) => {
    setDesktopOverlayActive(enabled);
    if (ipcRendererRef.current) {
      ipcRendererRef.current.invoke('system:toggle-desktop-overlay', enabled).catch(() => {});
    }
    showToast(enabled ? '🖥️ Superposición de escritorio activada' : '⚡ Superposición de escritorio desactivada (0% impacto en juegos)');
  };

  const handleToggleUltraPerf = (enabled) => {
    setUltraPerformanceMode(enabled);
    localStorage.setItem('stream_troll_ultra_perf', JSON.stringify(enabled));
    showToast(enabled ? '⚡ Modo Ultra FPS Gaming Activado: Renderizado 144+ FPS con 0 lag' : 'ℹ️ Modo Ultra FPS Desactivado');
  };

  // Gift Slider (OBS Overlay Carousel / Ticker) Configuration
  const [sliderConfig, setSliderConfig] = useState(() => {
    const defaults = {
      enabled: true,
      mode: 'marquee', // 'marquee' (continuous horizontal slider) | 'spotlight' (1-by-1 card carousel)
      position: 'top', // 'top' | 'bottom'
      spacingY: 16,    // vertical margin from top/bottom in px
      gap: 18,         // horizontal spacing between gift cards in px
      speed: 18,       // animation duration in seconds
      scale: 1,        // size multiplier
      reserveSpace: true,
      showOnDesktop: false
    };
    try {
      const saved = localStorage.getItem('stream_troll_slider_config');
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });
  const [showSliderSettings, setShowSliderSettings] = useState(true);

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

  // Persistent Config Disk Writer (guarantees settings stay saved across app restarts)
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

  const updateSliderConfig = useCallback((patch) => {
    setSliderConfig((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem('stream_troll_slider_config', JSON.stringify(next));
      } catch {}
      persistConfigToDisk({ sliderConfig: next });
      try {
        channel.postMessage({ type: 'ENGINE_CONFIG', sliderConfig: next });
      } catch {}
      return next;
    });
  }, [persistConfigToDisk]);

  // Screen selection state
  const [screens, setScreens] = useState([
    {
      id: 'screen-1',
      name: 'Screen 1',
      resolution: '1080 x 1920',
      position: 'Position: (0, 0)',
      isPrimary: true
    }
  ]);
  const [selectedScreenId, setSelectedScreenId] = useState('screen-1');

  // Real-time Metrics counters
  const [giftsReceivedCount, setGiftsReceivedCount] = useState(0);
  const [actionsExecutedCount, setActionsExecutedCount] = useState(0);
  const [queueLength, setQueueLength] = useState(0);

  // Activity Feed
  const [activityFeed, setActivityFeed] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Fake Alert State
  const [alertUser, setAlertUser] = useState('');
  const [alertAmount, setAlertAmount] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [useTTS, setUseTTS] = useState(false);

  // Check if running inside Electron
  const isElectron = typeof window !== 'undefined' && (window.process?.type || window.require);
  const ipcRendererRef = useRef(null);

  // OBS WebSocket & Overlay Execution states
  const [obsPort, setObsPort] = useState(4455);
  const [obsPassword, setObsPassword] = useState('');
  const [obsConnected, setObsConnected] = useState(false);
  const [obsConnecting, setObsConnecting] = useState(false);
  const [obsSceneName, setObsSceneName] = useState('');
  const [obsStatusMsg, setObsStatusMsg] = useState('');
  const obsSocketRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  // Unified real-time dispatcher: reaches OBS Studio Browser Source (SSE), Electron Main, and Pop-Out windows (BroadcastChannel)
  const dispatchToOverlay = useCallback((rawPayload) => {
    const payload = {
      ...rawPayload,
      eventId: rawPayload.eventId || `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    };

    try {
      channel.postMessage(payload);
    } catch {}

    if (ipcRendererRef.current) {
      try {
        ipcRendererRef.current.invoke('overlay:dispatch', payload).catch(() => {});
      } catch {}
    }

    const targets = ['http://127.0.0.1:18923/dispatch'];
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http') && !window.location.origin.includes('18923')) {
      targets.push(`${window.location.origin}/dispatch`);
    }

    targets.forEach((url) => {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    });
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('troll_me_lang', newLang);
  };

  // Sync Graphics Engine, Alignment Grid, Gift Mappings & Slider Config to Overlay
  useEffect(() => {
    dispatchToOverlay({
      type: 'ENGINE_CONFIG',
      graphicsEngine,
      alignmentGrid,
      giftMappings,
      sliderConfig
    });
  }, [graphicsEngine, alignmentGrid, giftMappings, sliderConfig, dispatchToOverlay]);

  // Filter and Sort Gifts for the Select Gift Modal (Image 1) with Multilingual Synonyms Support
  const filteredGifts = useMemo(() => {
    let list = [...TIKTOK_GIFTS_CATALOG];

    if (giftSearch.trim()) {
      const qNorm = normalizeGiftText(giftSearch);
      list = list.filter((g) => {
        const nameNorm = normalizeGiftText(g.name);
        if (nameNorm.includes(qNorm) || qNorm.includes(nameNorm)) return true;
        // Check synonym clusters
        for (const cluster of GIFT_SYNONYM_CLUSTERS) {
          const giftInCluster = cluster.aliases.some((a) => nameNorm.includes(a) || a.includes(nameNorm));
          const queryInCluster = cluster.aliases.some((a) => qNorm.includes(a) || a.includes(qNorm));
          if (giftInCluster && queryInCluster) return true;
        }
        return false;
      });
    }

    if (giftCoinFilter === '1') {
      list = list.filter((g) => g.coins === 1);
    } else if (giftCoinFilter === '2-10') {
      list = list.filter((g) => g.coins >= 2 && g.coins <= 10);
    } else if (giftCoinFilter === '11-100') {
      list = list.filter((g) => g.coins >= 11 && g.coins <= 100);
    } else if (giftCoinFilter === '101-1000') {
      list = list.filter((g) => g.coins >= 101 && g.coins <= 1000);
    } else if (giftCoinFilter === '1000+') {
      list = list.filter((g) => g.coins > 1000);
    }

    if (giftSortBy === 'low-to-high') {
      list.sort((a, b) => a.coins - b.coins);
    } else if (giftSortBy === 'high-to-low') {
      list.sort((a, b) => b.coins - a.coins);
    } else if (giftSortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [giftSearch, giftCoinFilter, giftSortBy]);

  // Detect screens from Electron or Browser
  const refreshScreens = useCallback(async () => {
    if (ipcRendererRef.current) {
      try {
        const detected = await ipcRendererRef.current.invoke('system:get-screens');
        if (Array.isArray(detected) && detected.length > 0) {
          setScreens(detected);
          showToast(`🖥️ ${detected.length} Pantalla(s) detectada(s)`);
          return;
        }
      } catch (err) {
        console.warn('Screen detection error:', err);
      }
    }

    const width = window.screen.width || 1920;
    const height = window.screen.height || 1080;
    setScreens([
      {
        id: 'screen-1',
        name: 'Screen 1',
        resolution: `${width} x ${height}`,
        position: 'Position: (0, 0)',
        isPrimary: true
      }
    ]);
    showToast('🔄 Pantalla actualizada');
  }, [showToast]);

  // Troll Me Auth Handlers (Only miguerodriguez1008@gmail.com has ULTIMATE plan)
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
    persistConfigToDisk({ trollUser: updated });
    setShowTrollMeLoginModal(false);
    showToast(isOwner ? '👑 ¡Bienvenido Migue! Acceso ULTIMATE activado' : `👋 ¡Bienvenido ${updated.username}! Plan Gratuito activo`);
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
      localStorage.removeItem('troll_me_user');
      localStorage.setItem('troll_me_user', JSON.stringify(updated));
    } catch {}
    persistConfigToDisk({ trollUser: updated });
    setTrollLoginEmail('');
    setTrollLoginPass('');
    showToast('👋 Sesión cerrada en Stream Troll');
  };

  // TikTok Login Window
  const openOfficialTikTokLogin = async () => {
    if (ipcRendererRef.current) {
      try {
        await ipcRendererRef.current.invoke('tiktok:open-login');
        showToast('🚀 Ventana de inicio de sesión de TikTok abierta');
        return;
      } catch (err) {
        console.warn('Electron open-login error:', err);
      }
    }
    window.open('https://www.tiktok.com/login', 'TikTokLoginWindow', 'width=820,height=760,menubar=no,toolbar=no');
    showToast('🌐 Ventana de inicio de sesión de TikTok abierta');
  };

  // OBS Connection Helpers
  const sha256Base64 = async (str) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
  };

  const connectObs = () => {
    if (obsSocketRef.current) {
      try { obsSocketRef.current.close(); } catch {}
    }

    setObsConnecting(true);
    setObsStatusMsg('Conectando con OBS en ws://127.0.0.1:' + obsPort + '...');

    try {
      const ws = new WebSocket(`ws://127.0.0.1:${obsPort}`);
      obsSocketRef.current = ws;

      ws.onopen = () => {
        setObsStatusMsg('Conexión establecida, identificando con OBS Studio...');
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.op === 0) {
            const { authentication } = msg.d;
            let authResponse = null;

            if (authentication) {
              if (!obsPassword) {
                setObsStatusMsg('⚠️ OBS requiere contraseña. Ingrésala abajo.');
                setObsConnecting(false);
                return;
              }
              const secret = await sha256Base64(obsPassword + authentication.salt);
              authResponse = await sha256Base64(secret + authentication.challenge);
            }

            ws.send(JSON.stringify({
              op: 1,
              d: {
                rpcVersion: 1,
                ...(authResponse ? { authentication: authResponse } : {})
              }
            }));
          } else if (msg.op === 2) {
            setObsConnected(true);
            setObsConnecting(false);
            setObsStatusMsg('🟢 ¡Conectado exitosamente con OBS Studio!');
            showToast('🟢 ¡Conectado con OBS Studio!');

            ws.send(JSON.stringify({
              op: 6,
              d: {
                requestType: 'GetCurrentProgramScene',
                requestId: 'get-current-scene'
              }
            }));
          } else if (msg.op === 7) {
            if (msg.d.requestId === 'get-current-scene' && msg.d.requestStatus?.result) {
              setObsSceneName(msg.d.responseData?.currentProgramSceneName || 'Escena Principal');
            } else if (msg.d.requestId === 'inject-overlay') {
              if (msg.d.requestStatus?.result) {
                showToast('🎉 ¡Fuente StreamTroll Overlay añadida en OBS!');
                setObsStatusMsg('✅ Fuente inyectada en la escena actual de OBS');
              } else {
                showToast('ℹ️ ' + (msg.d.requestStatus?.comment || 'Fuente procesada en OBS'));
              }
            } else if (msg.d.requestId === 'inject-slider') {
              if (msg.d.requestStatus?.result) {
                showToast('🎉 ¡Fuente Slider de Regalos añadida en OBS!');
                setObsStatusMsg('✅ Slider inyectado en la escena actual de OBS');
              } else {
                showToast('ℹ️ ' + (msg.d.requestStatus?.comment || 'Slider procesado en OBS'));
              }
            } else if (msg.d.requestId === 'inject-timer') {
              if (msg.d.requestStatus?.result) {
                showToast('🎉 ¡Fuente Cronómetro Subatón añadida en OBS!');
                setObsStatusMsg('✅ Cronómetro inyectado en la escena actual de OBS');
              } else {
                showToast('ℹ️ ' + (msg.d.requestStatus?.comment || 'Cronómetro procesado en OBS'));
              }
            }
          }
        } catch (err) {
          console.error('OBS message error:', err);
        }
      };

      ws.onerror = () => {
        setObsConnecting(false);
        setObsConnected(false);
        setObsStatusMsg('🔴 No se pudo conectar a OBS. Verifica que OBS esté abierto.');
      };

      ws.onclose = () => {
        setObsConnected(false);
        setObsConnecting(false);
      };
    } catch (err) {
      setObsConnecting(false);
      setObsStatusMsg('🔴 Error al conectar: ' + err.message);
    }
  };

  const disconnectObs = () => {
    if (obsSocketRef.current) {
      try { obsSocketRef.current.close(); } catch {}
      obsSocketRef.current = null;
    }
    setObsConnected(false);
    setObsStatusMsg('Desconectado de OBS');
    showToast('Desconectado de OBS');
  };

  const injectOverlayIntoObs = () => {
    if (!obsSocketRef.current || !obsConnected) {
      alert('Conecta primero con OBS Studio.');
      return;
    }

    const overlayUrl = isElectron 
      ? 'http://127.0.0.1:18923/#/overlay' 
      : `${window.location.origin}${window.location.pathname}#/overlay`;

    obsSocketRef.current.send(JSON.stringify({
      op: 6,
      d: {
        requestType: 'CreateInput',
        requestId: 'inject-overlay',
        requestData: {
          sceneName: obsSceneName || undefined,
          inputName: 'StreamTroll Overlay',
          inputKind: 'browser_source',
          inputSettings: {
            url: overlayUrl,
            width: 1920,
            height: 1080,
            fps: 60,
            restart_when_active: true,
            shutdown: false
          }
        }
      }
    }));
  };

  const downloadObsDragFile = () => {
    const overlayUrl = isElectron 
      ? 'http://127.0.0.1:18923/#/overlay' 
      : `${window.location.origin}${window.location.pathname}#/overlay`;

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>StreamTroll Overlay</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: transparent; }
    iframe { width: 100%; height: 100%; border: none; background: transparent; }
  </style>
</head>
<body>
  <iframe src="${overlayUrl}" allow="autoplay"></iframe>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'StreamTroll_OBS_Overlay.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 ¡Archivo descargado! Arrástralo adentro de la ventana de OBS');
  };

  const openPopout = (chroma = false) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const overlayUrl = `${baseUrl}#/overlay${chroma ? '?chroma=true' : ''}`;
    window.open(
      overlayUrl,
      'StreamTrollOverlayWindow',
      'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    );
    showToast(chroma ? '🟩 Ventana Chroma abierta para captura' : '🪟 Ventana Pop-out abierta');
  };

  const injectSliderIntoObs = () => {
    if (!obsSocketRef.current || !obsConnected) {
      alert('Conecta primero con OBS Studio en la pestaña Overlay.');
      return;
    }

    const sliderUrl = isElectron 
      ? 'http://127.0.0.1:18923/#/slider' 
      : `${window.location.origin}${window.location.pathname}#/slider`;

    obsSocketRef.current.send(JSON.stringify({
      op: 6,
      d: {
        requestType: 'CreateInput',
        requestId: 'inject-slider',
        requestData: {
          sceneName: obsSceneName || undefined,
          inputName: 'StreamTroll Slider Regalos',
          inputKind: 'browser_source',
          inputSettings: {
            url: sliderUrl,
            width: 1920,
            height: 110,
            fps: 60,
            restart_when_active: true,
            shutdown: false
          }
        }
      }
    }));
  };

  const downloadSliderDragFile = () => {
    const sliderUrl = isElectron 
      ? 'http://127.0.0.1:18923/#/slider' 
      : `${window.location.origin}${window.location.pathname}#/slider`;

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>StreamTroll Slider Regalos</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: transparent; }
    iframe { width: 100%; height: 100%; border: none; background: transparent; }
  </style>
</head>
<body>
  <iframe src="${sliderUrl}" allow="autoplay"></iframe>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'StreamTroll_OBS_Slider_Regalos.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 ¡Archivo de Slider descargado! Arrástralo adentro de OBS');
  };

  const openSliderPopout = (chroma = false) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const sliderUrl = `${baseUrl}#/slider${chroma ? '?chroma=true' : ''}`;
    window.open(
      sliderUrl,
      'StreamTrollSliderWindow',
      'width=1200,height=130,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    );
    showToast(chroma ? '🟩 Ventana Chroma del Slider abierta' : '🎠 Ventana Pop-out del Slider abierta');
  };

  const injectTimerIntoObs = () => {
    if (!obsSocketRef.current || !obsConnected) {
      alert('Conecta primero con OBS Studio en la pestaña Overlay.');
      return;
    }

    const timerUrl = isElectron 
      ? 'http://127.0.0.1:18923/#/timer' 
      : `${window.location.origin}${window.location.pathname}#/timer`;

    obsSocketRef.current.send(JSON.stringify({
      op: 6,
      d: {
        requestType: 'CreateInput',
        requestId: 'inject-timer',
        requestData: {
          sceneName: obsSceneName || undefined,
          inputName: 'StreamTroll Cronómetro Subatón',
          inputKind: 'browser_source',
          inputSettings: {
            url: timerUrl,
            width: 500,
            height: 180,
            fps: 60,
            restart_when_active: true,
            shutdown: false
          }
        }
      }
    }));
  };

  const downloadTimerDragFile = () => {
    const timerUrl = isElectron 
      ? 'http://127.0.0.1:18923/#/timer' 
      : `${window.location.origin}${window.location.pathname}#/timer`;

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>StreamTroll Cronómetro Subatón</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: transparent; }
    iframe { width: 100%; height: 100%; border: none; background: transparent; }
  </style>
</head>
<body>
  <iframe src="${timerUrl}" allow="autoplay"></iframe>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'StreamTroll_OBS_Timer_Subaton.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 ¡Archivo del Cronómetro descargado! Arrástralo adentro de OBS');
  };

  const openTimerPopout = (chroma = false) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const timerUrl = `${baseUrl}#/timer${chroma ? '?chroma=true' : ''}`;
    window.open(
      timerUrl,
      'StreamTrollTimerWindow',
      'width=500,height=220,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    );
    showToast(chroma ? '🟩 Ventana Chroma del Cronómetro abierta' : '⏱️ Ventana Pop-out del Cronómetro abierta');
  };

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
          if (Array.isArray(loaded.giftGraphics) && loaded.giftGraphics.length > 0) {
            setGiftGraphics(loaded.giftGraphics);
            try {
              localStorage.setItem('stream_troll_gift_graphics', JSON.stringify(loaded.giftGraphics));
            } catch {}
          }
          if (loaded.trollUser && loaded.trollUser.email && loaded.trollUser.isLoggedIn) {
            const isMigue = loaded.trollUser.email.toLowerCase().trim() === 'miguerodriguez1008@gmail.com';
            setTrollUser({
              ...loaded.trollUser,
              isLoggedIn: true,
              plan: isMigue ? 'ULTIMATE' : 'GRATUITO',
              avatar: isMigue ? '👑' : '😎'
            });
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
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
      showToast(seconds > 0 ? `⏱️ +${Math.round(seconds / 60)} min añadidos al Timer` : `⏱️ -${Math.round(Math.abs(seconds) / 60)} min restados del Timer`);
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
      showToast(`🔄 Timer reiniciado a ${formatTime(resetVal)}`);
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

    showToast(`⏱️ +${secondsToAdd}s añadidos al Timer (${reasonText || 'Donación'})`);
  }, [persistConfigToDisk, dispatchToOverlay, showToast]);

  const downloadTimerHtml = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const timerUrl = `${baseUrl}#/timer`;
    const htmlContent = `<!DOCTYPE html>
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
  <iframe src="${timerUrl}" allow="autoplay"></iframe>
</body>
</html>`;

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

  const addSpecificTimerRule = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTimerRuleGiftName.trim()) {
      showToast('⚠️ Escribe el nombre del regalo');
      return;
    }
    const rule = {
      id: `tg-${Date.now()}`,
      giftName: newTimerRuleGiftName.trim(),
      seconds: Number(newTimerRuleSeconds) || 60,
      enabled: true
    };
    const updatedRules = [...(timerConfig.specificGiftRules || []), rule];
    saveTimerConfig({ specificGiftRules: updatedRules });
    setNewTimerRuleGiftName('');
    setNewTimerRuleSeconds(60);
    showToast(`✅ Regla para "${rule.giftName}" agregada (+${rule.seconds}s)`);
  };

  const removeSpecificTimerRule = (id) => {
    const updatedRules = (timerConfig.specificGiftRules || []).filter((r) => r.id !== id);
    saveTimerConfig({ specificGiftRules: updatedRules });
    showToast('🗑️ Regla de regalo eliminada');
  };


  const sendEffect = useCallback((effectName, durationSec = 8) => {
    if (!graphicsEngine) {
      showToast('⚠️ Graphics Engine está apagado');
      return;
    }
    setQueueLength((q) => q + 1);
    dispatchToOverlay({
      type: 'SHADER',
      effect: effectName,
      duration: durationSec * 1000
    });
    setTimeout(() => {
      setQueueLength((q) => Math.max(0, q - 1));
    }, durationSec * 1000);
  }, [graphicsEngine, showToast, dispatchToOverlay]);

  // TRIGGER ENGINE: Maps gifts to triggers (with synonyms, combo tracking, and coin rules)
  const handleIncomingGift = useCallback((giftEvent) => {
    const { 
      user = 'Espectador', 
      giftName = 'Regalo', 
      giftId = null, 
      diamondCount = 0, 
      repeatCount = 1,
      repeatEnd = true,
      groupId = null 
    } = giftEvent;

    setGiftsReceivedCount((c) => c + 1);

    const comboKey = `${user}_${giftId || giftName}`;

    // Helper to actually dispatch the effect and activity feed once a gift/combo is ready
    const dispatchGiftEffect = (finalRepeatCount, totalCoins) => {
      let matched = false;

      giftMappings.forEach((m) => {
        if (!m.enabled) return;

        let isMatch = false;

        if (m.type === 'coins') {
          // Mapping by coin threshold (e.g. any gift >= 500 coins)
          if (totalCoins >= Number(m.minCoins || 1)) {
            isMatch = true;
          }
        } else {
          // Mapping by gift name / synonym / giftId
          if (isGiftNameMatch(giftName, m.giftName, giftId, m.giftId)) {
            isMatch = true;
          } else if (m.type === 'coins' && totalCoins >= Number(m.minCoins || 1)) {
            isMatch = true;
          }
        }

        if (isMatch) {
          matched = true;
          setActionsExecutedCount((c) => c + 1);
          sendEffect(m.effect, m.duration);

          const comboLabel = finalRepeatCount > 1 ? ` x${finalRepeatCount}` : '';

          if (m.tts) {
            dispatchToOverlay({
              type: 'ALERT',
              user: user,
              amount: `${totalCoins} 🪙`,
              message: `¡Envió ${giftName}${comboLabel}! Shader ${m.effect.toUpperCase()} activado`,
              tts: true
            });
          }

          setActivityFeed((prev) => [
            {
              id: Date.now() + Math.random(),
              time: new Date().toLocaleTimeString(),
              user,
              giftName: `${giftName}${comboLabel}`,
              coins: totalCoins,
              effect: m.effect,
              duration: m.duration,
              rule: m.type === 'coins' ? `Monedas: ≥${m.minCoins} 🪙` : `Regalo: ${m.giftName}`
            },
            ...prev.slice(0, 14)
          ]);
        }
      });

      // Check matching Gift Graphics (On-screen 3D animations, rain, bursts)
      if (Array.isArray(giftGraphics)) {
        giftGraphics.forEach((g) => {
          if (!g.enabled) return;
          const matchGraph = isGiftNameMatch(giftName, g.triggerGift, giftId) || (g.triggerCoins && totalCoins >= g.triggerCoins);
          if (matchGraph) {
            dispatchToOverlay({
              type: 'GIFT_GRAPHIC',
              graphic: {
                ...g,
                user,
                giftName,
                coins: totalCoins
              }
            });
          }
        });
      }

      if (!matched) {
        const comboLabel = finalRepeatCount > 1 ? ` x${finalRepeatCount}` : '';
        setActivityFeed((prev) => [
          {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            user,
            giftName: `${giftName}${comboLabel}`,
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
          ruleLabel = `${user}: ${giftName}${finalRepeatCount > 1 ? ` x${finalRepeatCount}` : ''}`;
        } else if (Number(totalCoins) > 0) {
          const secPerCoin = Number(timerConfigRef.current.secondsPerCoin) || 5;
          addedSeconds = Math.round(totalCoins * secPerCoin);
          ruleLabel = `${user}: ${totalCoins} 🪙 (${giftName}${finalRepeatCount > 1 ? ` x${finalRepeatCount}` : ''})`;
        }

        if (addedSeconds > 0) {
          addSecondsToTimer(addedSeconds, ruleLabel);
        }
      }
    };

    // If comboMode is 'every_gift': dispatch immediately on every tick
    if (comboMode === 'every_gift') {
      const coinsThisTick = (diamondCount || 0) * (repeatCount || 1);
      dispatchGiftEffect(repeatCount, coinsThisTick);
      return;
    }

    // Default: 'streak_end' mode (recommended to avoid spamming 50 shaders in a 50-rose combo)
    if (repeatEnd === true || (!groupId && repeatCount === 1)) {
      if (pendingCombosRef.current[comboKey]) {
        clearTimeout(pendingCombosRef.current[comboKey].timer);
        delete pendingCombosRef.current[comboKey];
      }
      const totalCoins = (diamondCount || 0) * repeatCount;
      dispatchGiftEffect(repeatCount, totalCoins);
    } else {
      // In-progress streak (repeatEnd === false)
      if (pendingCombosRef.current[comboKey]) {
        clearTimeout(pendingCombosRef.current[comboKey].timer);
      }

      // Fallback timer: if repeatEnd packet is dropped, finalize combo after 1300ms of silence
      const timer = setTimeout(() => {
        delete pendingCombosRef.current[comboKey];
        const totalCoins = (diamondCount || 0) * repeatCount;
        dispatchGiftEffect(repeatCount, totalCoins);
      }, 1300);

      pendingCombosRef.current[comboKey] = {
        timer,
        user,
        giftName,
        repeatCount,
        diamondCount
      };
    }
  }, [giftMappings, sendEffect, comboMode, dispatchToOverlay]);

  // TRIGGER ENGINE: Maps events (Follow, Share, Likes, etc.)
  const handleIncomingEvent = useCallback((eventData) => {
    const { eventType, user = 'Espectador' } = eventData;
    let matched = false;

    eventMappings.forEach((m) => {
      if (!m.enabled) return;

      if (m.eventType === eventType || m.eventName.toLowerCase().includes(eventType.toLowerCase())) {
        matched = true;
        setActionsExecutedCount((c) => c + 1);
        sendEffect(m.effect, m.duration);

        if (m.tts) {
          dispatchToOverlay({
            type: 'ALERT',
            user,
            amount: 'EVENTO',
            message: `¡${user}: ${m.eventName}! Shader ${m.effect.toUpperCase()} activado`,
            tts: true
          });
        }

        setActivityFeed((prev) => [
          {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            user,
            giftName: m.eventName,
            coins: 0,
            effect: m.effect,
            duration: m.duration,
            rule: `Evento: ${m.eventName}`
          },
          ...prev.slice(0, 14)
        ]);
      }
    });

    if (matched) {
      showToast(`⚡ Evento ${eventType} activó un shader`);
    }

    // Extensible Timer Event addition (Follow, Share, Sub)
    if (timerConfigRef.current?.enabled) {
      if ((eventType === 'follow') && Number(timerConfigRef.current.addTimeFollow) > 0) {
        addSecondsToTimer(Number(timerConfigRef.current.addTimeFollow), `${user}: Follow (+ ${timerConfigRef.current.addTimeFollow}s)`);
      } else if ((eventType === 'share' || eventType === 'social') && Number(timerConfigRef.current.addTimeShare) > 0) {
        addSecondsToTimer(Number(timerConfigRef.current.addTimeShare), `${user}: Compartir (+ ${timerConfigRef.current.addTimeShare}s)`);
      } else if ((eventType === 'sub' || eventType === 'subscribe' || eventType === 'superfan') && Number(timerConfigRef.current.addTimeSub) > 0) {
        addSecondsToTimer(Number(timerConfigRef.current.addTimeSub), `${user}: Suscripción (+ ${timerConfigRef.current.addTimeSub}s)`);
      }
    }
  }, [eventMappings, sendEffect, showToast, dispatchToOverlay, addSecondsToTimer]);

  // Connect to TikTok Live
  const connectTikTok = async () => {
    if (!tiktokUser.trim()) {
      alert('Ingresa un usuario válido de TikTok (ej: @streamer)');
      return;
    }

    setIsConnecting(true);

    if (ipcRendererRef.current) {
      try {
        const res = await ipcRendererRef.current.invoke('tiktok:connect', tiktokUser);
        setIsConnecting(false);
        if (res.success) {
          setIsConnected(true);
          setConnectionStatus(`🟢 Conectado en vivo al directo de @${res.username}`);
          showToast(`¡Conexión nativa con @${res.username} activa!`);
          setShowTikTokModal(false);
        } else {
          setIsConnected(false);
          setConnectionStatus(`🔴 Error: ${res.error}`);
          alert(`Error de conexión: ${res.error}`);
        }
      } catch (err) {
        setIsConnecting(false);
        alert(`Error al invocar conexión en Electron: ${err.message}`);
      }
    } else {
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        setConnectionStatus(`🟢 Modo Web / Simulación Activo para @${tiktokUser}`);
        showToast('¡Modo simulación web activo! TikTok conectado.');
        setShowTikTokModal(false);
      }, 600);
    }
  };

  const disconnectTikTok = async () => {
    if (ipcRendererRef.current) {
      await ipcRendererRef.current.invoke('tiktok:disconnect');
    }
    setIsConnected(false);
    setConnectionStatus('🔴 Desconectado');
    showToast('Desconectado de TikTok Live');
  };

  // Sound effects generator
  const playSoundEffect = (type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'fbi') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } else if (type === 'screamer') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.setValueAtTime(300, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
      showToast(`🔊 Reproduciendo: ${type.toUpperCase()}`);
    } catch {
      alert(`Reproduciendo sonido: ${type}`);
    }
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
  };

  const deleteGiftMapping = (id) => {
    const updated = giftMappings.filter((m) => m.id !== id);
    saveGiftMappings(updated);
    showToast('🗑️ Mapeo de regalo eliminado');
  };

  const deleteEventMapping = (id) => {
    const updated = eventMappings.filter((m) => m.id !== id);
    saveEventMappings(updated);
    showToast('🗑️ Mapeo de evento eliminado');
  };

  const toggleGiftMapping = (id, enabled) => {
    const updated = giftMappings.map((m) => (m.id === id ? { ...m, enabled } : m));
    saveGiftMappings(updated);
  };

  const toggleEventMapping = (id, enabled) => {
    const updated = eventMappings.map((m) => (m.id === id ? { ...m, enabled } : m));
    saveEventMappings(updated);
  };

  const saveGiftGraphics = (updated) => {
    const data = updated || giftGraphics;
    setGiftGraphics([...data]);
    try {
      localStorage.setItem('stream_troll_gift_graphics', JSON.stringify(data));
    } catch {}
    persistConfigToDisk({ giftGraphics: data });
    try {
      channel.postMessage({ type: 'ENGINE_CONFIG', giftGraphics: data });
    } catch {}
    dispatchToOverlay({ type: 'ENGINE_CONFIG', giftGraphics: data });
  };

  const toggleGiftGraphic = (id, enabled) => {
    const updated = giftGraphics.map((g) => (g.id === id ? { ...g, enabled } : g));
    saveGiftGraphics(updated);
    showToast(enabled ? '🟢 Animación activada en OBS' : '⏸️ Animación desactivada');
  };

  const deleteGiftGraphic = (id) => {
    const updated = giftGraphics.filter((g) => g.id !== id);
    saveGiftGraphics(updated);
    showToast('🗑️ Animación gráfica eliminada');
  };

  const resetDefaultGiftGraphics = () => {
    saveGiftGraphics(DEFAULT_GIFT_GRAPHICS);
    showToast('🔄 Animaciones gráficas restablecidas por defecto');
  };

  const testGiftGraphic = (graphic) => {
    dispatchToOverlay({
      type: 'GIFT_GRAPHIC',
      graphic: {
        ...graphic,
        user: 'StreamTroll_Fan',
        giftName: graphic.triggerGift || graphic.name
      }
    });
    showToast(`▶ Probando "${graphic.name}" en pantalla OBS`);
  };

  const openCreateGraphicModal = () => {
    setEditingGraphic(null);
    setGraphicFormName('');
    setGraphicFormTriggerGift('Rose');
    setGraphicFormTriggerCoins(1);
    setGraphicFormIcon('🌹');
    setGraphicFormImage('https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp');
    setGraphicFormAnimType('rain');
    setGraphicFormParticleCount(25);
    setGraphicFormDuration(5);
    setGraphicFormSound('pop');
    setGraphicCatalogSearch('');
    setShowGraphicModal(true);
  };

  const openEditGraphicModal = (g) => {
    setEditingGraphic(g);
    setGraphicFormName(g.name || '');
    setGraphicFormTriggerGift(g.triggerGift || 'Rose');
    setGraphicFormTriggerCoins(g.triggerCoins || 1);
    setGraphicFormIcon(g.icon || '🌹');
    setGraphicFormImage(g.image || '');
    setGraphicFormAnimType(g.animationType || 'rain');
    setGraphicFormParticleCount(g.particleCount || 25);
    setGraphicFormDuration(g.duration || 5);
    setGraphicFormSound(g.sound || 'pop');
    setGraphicCatalogSearch('');
    setShowGraphicModal(true);
  };

  const handleSaveGraphicForm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!graphicFormName.trim()) {
      showToast('⚠️ Ingresa un nombre para la animación');
      return;
    }
    if (editingGraphic) {
      const updated = giftGraphics.map((g) => (g.id === editingGraphic.id ? {
        ...g,
        name: graphicFormName.trim(),
        triggerGift: graphicFormTriggerGift,
        triggerCoins: Number(graphicFormTriggerCoins) || 1,
        icon: graphicFormIcon || '✨',
        image: graphicFormImage,
        animationType: graphicFormAnimType,
        particleCount: Number(graphicFormParticleCount) || 20,
        duration: Number(graphicFormDuration) || 5,
        sound: graphicFormSound
      } : g));
      saveGiftGraphics(updated);
      showToast(`✅ Animación "${graphicFormName}" guardada con éxito`);
    } else {
      const newGraphic = {
        id: `gg-${Date.now()}`,
        name: graphicFormName.trim(),
        triggerGift: graphicFormTriggerGift,
        triggerCoins: Number(graphicFormTriggerCoins) || 1,
        icon: graphicFormIcon || '✨',
        image: graphicFormImage,
        animationType: graphicFormAnimType,
        particleCount: Number(graphicFormParticleCount) || 20,
        duration: Number(graphicFormDuration) || 5,
        sound: graphicFormSound,
        enabled: true
      };
      saveGiftGraphics([...giftGraphics, newGraphic]);
      showToast(`🎉 ¡Nueva animación "${graphicFormName}" creada!`);
    }
    setShowGraphicModal(false);
  };

  const saveNewMapping = () => {
    if (!configuringTrigger) return;

    if (configuringTrigger.type === 'gift') {
      const gift = configuringTrigger.item;
      const labelText = (selectedCustomLabel || gift.name || '').trim();
      const newMapping = {
        id: `map-${Date.now()}`,
        type: 'gift',
        giftId: gift.id || gift.giftId,
        giftName: gift.name,
        customLabel: labelText,
        giftIcon: gift.icon || '🎁',
        giftImage: gift.image || gift.giftImage || '',
        minCoins: gift.coins || gift.price || 1,
        effect: selectedEffect,
        duration: selectedDuration,
        tts: selectedTts,
        enabled: true
      };
      saveGiftMappings([...giftMappings, newMapping]);
      showToast(`🎉 ¡Mapeo añadido: ${gift.name} ➔ ${selectedEffect}!`);
    } else if (configuringTrigger.type === 'coins') {
      const minC = Number(selectedMinCoins) || 100;
      const labelText = (selectedCustomLabel || `+${minC} COINS`).trim();
      const newMapping = {
        id: `map-coins-${Date.now()}`,
        type: 'coins',
        giftName: `Cualquier Regalo (≥ ${minC} 🪙)`,
        customLabel: labelText,
        giftIcon: '🪙',
        minCoins: minC,
        effect: selectedEffect,
        duration: selectedDuration,
        tts: selectedTts,
        enabled: true
      };
      saveGiftMappings([...giftMappings, newMapping]);
      showToast(`🪙 ¡Mapeo añadido: ≥ ${minC} Monedas ➔ ${selectedEffect}!`);
    } else if (configuringTrigger.type === 'event') {
      const evt = configuringTrigger.item;
      const newMapping = {
        id: `evt-${Date.now()}`,
        eventType: evt.id,
        eventName: evt.name,
        icon: evt.icon,
        effect: selectedEffect,
        duration: selectedDuration,
        tts: selectedTts,
        enabled: true
      };
      saveEventMappings([...eventMappings, newMapping]);
      showToast(`⚡ ¡Mapeo añadido: ${evt.name} ➔ ${selectedEffect}!`);
    }

    setSelectedCustomLabel('');
    setConfiguringTrigger(null);
    setShowGiftModal(false);
    setShowEventModal(false);
  };

  // Electron IPC Listeners
  useEffect(() => {
    if (isElectron && window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRendererRef.current = ipcRenderer;

        const handleTiktokGift = (_event, giftData) => {
          handleIncomingGift({
            user: giftData.user,
            giftName: giftData.giftName,
            giftId: giftData.giftId,
            diamondCount: giftData.diamondCount,
            repeatCount: giftData.repeatCount,
            repeatEnd: giftData.repeatEnd,
            groupId: giftData.groupId
          });
        };

        const handleTiktokEvent = (_event, eventData) => {
          handleIncomingEvent(eventData);
        };

        const handleTiktokStatus = (_event, status) => {
          setIsConnected(status.connected);
          setConnectionStatus(status.message);
        };

        ipcRenderer.on('tiktok:gift', handleTiktokGift);
        ipcRenderer.on('tiktok:event', handleTiktokEvent);
        ipcRenderer.on('tiktok:status', handleTiktokStatus);

        return () => {
          ipcRenderer.removeListener('tiktok:gift', handleTiktokGift);
          ipcRenderer.removeListener('tiktok:event', handleTiktokEvent);
          ipcRenderer.removeListener('tiktok:status', handleTiktokStatus);
        };
      } catch (err) {
        console.warn('IPC setup error:', err);
      }
    }
  }, [handleIncomingGift, handleIncomingEvent, isElectron]);

  // Strict Gate check: If user has not logged in, render ONLY the full-screen Login Screen.
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
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-success">{toastMessage}</div>}

      {/* =========================================================
          SIDEBAR NAVIGATION (STREAM TROLL STYLE)
          ========================================================= */}
      <div className="sidebar" style={{ overflowY: 'auto' }}>
        {/* Retro Pixel Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="troll-logo-retro">
            STREAM TROLL
          </div>
        </Link>

        {/* Flag Bar (Language Selector - Centered with Crisp Flag Badges) */}
        <div className="flags-bar">
          <button 
            className={`flag-btn ${lang === 'es' ? 'active' : ''}`} 
            onClick={() => changeLanguage('es')}
            title="Español (ES)"
          >
            <svg width="26" height="18" viewBox="0 0 750 500" style={{ borderRadius: '3px', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              <rect width="750" height="500" fill="#c60b1e"/>
              <rect width="750" height="250" y="125" fill="#ffc400"/>
              <circle cx="230" cy="250" r="45" fill="#c60b1e"/>
              <circle cx="230" cy="250" r="30" fill="#ffc400"/>
            </svg>
          </button>
          <button 
            className={`flag-btn ${lang === 'en' ? 'active' : ''}`} 
            onClick={() => changeLanguage('en')}
            title="English (US)"
          >
            <svg width="26" height="18" viewBox="0 0 24 16" style={{ borderRadius: '3px', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              <rect width="24" height="16" fill="#b22234"/>
              <rect y="1.23" width="24" height="1.23" fill="#fff"/>
              <rect y="3.69" width="24" height="1.23" fill="#fff"/>
              <rect y="6.15" width="24" height="1.23" fill="#fff"/>
              <rect y="8.61" width="24" height="1.23" fill="#fff"/>
              <rect y="11.07" width="24" height="1.23" fill="#fff"/>
              <rect y="13.53" width="24" height="1.23" fill="#fff"/>
              <rect width="10" height="8.6" fill="#3c3b6e"/>
              <g fill="#fff">
                <circle cx="2" cy="2" r="0.6"/>
                <circle cx="5" cy="2" r="0.6"/>
                <circle cx="8" cy="2" r="0.6"/>
                <circle cx="3.5" cy="4.3" r="0.6"/>
                <circle cx="6.5" cy="4.3" r="0.6"/>
                <circle cx="2" cy="6.6" r="0.6"/>
                <circle cx="5" cy="6.6" r="0.6"/>
                <circle cx="8" cy="6.6" r="0.6"/>
              </g>
            </svg>
          </button>
          <button 
            className={`flag-btn ${lang === 'pt' ? 'active' : ''}`} 
            onClick={() => changeLanguage('pt')}
            title="Português (BR)"
          >
            <svg width="26" height="18" viewBox="0 0 24 16" style={{ borderRadius: '3px', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              <rect width="24" height="16" fill="#009c3b"/>
              <polygon points="12,1.5 22,8 12,14.5 2,8" fill="#ffdf00"/>
              <circle cx="12" cy="8" r="3.6" fill="#002776"/>
              <path d="M8.5,8 A3.6,3.6 0 0,0 15.5,8" stroke="#fff" strokeWidth="0.6" fill="none"/>
            </svg>
          </button>
        </div>

        {/* User Profile Card (Stream Troll Account) */}
        <div className="user-profile-box">
          {trollUser.isLoggedIn ? (
            <>
              <div className="user-profile-row">
                <div className="user-avatar-img">
                  <span>{trollUser.avatar || '😎'}</span>
                </div>
                <div className="user-info-text">
                  <span className="user-email-truncate" title={trollUser.email}>
                    {trollUser.email}
                  </span>
                  <span className="plan-badge-ultimate">
                    {trollUser.plan || 'ULTIMATE'}
                  </span>
                </div>
              </div>
              <button className="btn-sidebar-logout" onClick={logoutTrollMe}>
                <span>↳</span> {t.logout}
              </button>
            </>
          ) : (
            <button className="btn-sidebar-login" onClick={() => setShowTrollMeLoginModal(true)}>
              <span>🔑</span> {t.loginTrollMe}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {/* 1. Dashboard */}
          <div 
            className={`nav-item-pill ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="nav-item-left">
              <span>⊞</span>
              <span>{t.dashboard}</span>
            </div>
          </div>

          {/* 2. Mappings */}
          <div 
            className={`nav-item-pill ${activeTab === 'mappings' ? 'active' : ''}`}
            onClick={() => setActiveTab('mappings')}
          >
            <div className="nav-item-left">
              <span>⚡</span>
              <span>{t.mappings}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span className="nav-pill-badge badge-new">{t.badgeNew || 'NEW'}</span>
              <span className="nav-pill-badge badge-money">$</span>
            </div>
          </div>

          {/* Slider de Regalos (OBS Overlay) */}
          <div 
            className={`nav-item-pill ${activeTab === 'slider' ? 'active' : ''}`}
            onClick={() => setActiveTab('slider')}
          >
            <div className="nav-item-left">
              <span>🎠</span>
              <span>{t.slider || 'Slider de Regalos'}</span>
            </div>
            <span className="nav-pill-badge badge-new">{t.badgeObs || 'OBS'}</span>
          </div>

          {/* 3. Tips & Donations */}
          <div 
            className={`nav-item-pill ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveTab('tips')}
          >
            <div className="nav-item-left">
              <span>🤍</span>
              <span>{t.tips}</span>
            </div>
            <span className="nav-pill-badge badge-money">$</span>
          </div>

          {/* 4. Contests & Raffles */}
          <div 
            className={`nav-item-pill ${activeTab === 'contests' ? 'active' : ''}`}
            onClick={() => setActiveTab('contests')}
          >
            <div className="nav-item-left">
              <span>🏆</span>
              <span>{t.contests}</span>
            </div>
            <span className="nav-pill-badge badge-soon">{t.badgeSoon || 'PRONTO'}</span>
          </div>

          {/* 5. Chatbot */}
          <div 
            className={`nav-item-pill ${activeTab === 'chatbot' ? 'active' : ''}`}
            onClick={() => setActiveTab('chatbot')}
          >
            <div className="nav-item-left">
              <span>🤖</span>
              <span>{t.chatbot}</span>
            </div>
          </div>

          {/* 6. Gift Graphics */}
          <div 
            className={`nav-item-pill ${activeTab === 'gift-graphics' ? 'active' : ''}`}
            onClick={() => setActiveTab('gift-graphics')}
          >
            <div className="nav-item-left">
              <span>🖼️</span>
              <span>{t.giftGraphics}</span>
            </div>
            <span className="badge-dot"></span>
          </div>

          {/* 7. Extensible Timer */}
          <div 
            className={`nav-item-pill ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <div className="nav-item-left">
              <span>⏱️</span>
              <span>{t.timer}</span>
            </div>
            <span className="nav-pill-badge badge-new">{t.badgeNew || 'NEW'}</span>
          </div>

          {/* 8. Planes (Free vs Ultimate) */}
          <div 
            className={`nav-item-pill ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
            style={{ border: '1px solid rgba(234, 179, 8, 0.3)', background: activeTab === 'plans' ? 'rgba(234, 179, 8, 0.15)' : 'transparent', marginTop: '4px' }}
          >
            <div className="nav-item-left">
              <span>👑</span>
              <span style={{ color: '#fde047', fontWeight: 700 }}>{t.plans || 'Planes (Free vs Pro)'}</span>
            </div>
            <span className="nav-pill-badge badge-pro">{t.badgePro || 'PRO'}</span>
          </div>

          {/* Utility Tools */}
          <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div 
              className={`nav-item-pill ${activeTab === 'shaders' ? 'active' : ''}`}
              onClick={() => setActiveTab('shaders')}
            >
              <div className="nav-item-left">
                <span>✨</span>
                <span>{t.shaders}</span>
              </div>
            </div>
            <div 
              className={`nav-item-pill ${activeTab === 'overlay' ? 'active' : ''}`}
              onClick={() => setActiveTab('overlay')}
            >
              <div className="nav-item-left">
                <span>🖥️</span>
                <span>{t.overlay}</span>
              </div>
            </div>
            <div 
              className={`nav-item-pill ${activeTab === 'soundboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('soundboard')}
            >
              <div className="nav-item-left">
                <span>🔊</span>
                <span>{t.soundboard}</span>
              </div>
            </div>
            <div 
              className={`nav-item-pill ${activeTab === 'alertas' ? 'active' : ''}`}
              onClick={() => setActiveTab('alertas')}
            >
              <div className="nav-item-left">
                <span>💸</span>
                <span>Alertas & TTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div>
            <div>BY: Logix_haze</div>
            <div style={{ fontSize: '0.7rem', color: '#475569' }}>v1.2.0 • ZENIC S.A.S</div>
            <a 
              href="#/legal" 
              target="_blank" 
              rel="noreferrer" 
              style={{ fontSize: '0.74rem', color: '#94a3b8', textDecoration: 'underline', display: 'inline-block', marginTop: '3px' }}
            >
              📜 Legal & Privacidad
            </a>
          </div>
          <button 
            className="btn-discord-support"
            onClick={() => window.open('https://discord.gg', '_blank')}
          >
            <span>💬</span> {t.support}
          </button>
        </div>
      </div>

      {/* =========================================================
          MAIN CONTENT AREA
          ========================================================= */}
      <div className="main-content" style={{ overflowY: 'auto' }}>
        
        {/* =========================================================
            TOP ACTION ROW / BANNERS
            ========================================================= */}
        <div className="top-action-bar">
          {/* 1. Green Promo Card */}
          <div className="banner-tips-donations">
            <div className="banner-tips-content">
              <div className="banner-tips-icon">💰</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="nav-pill-badge" style={{ background: '#10b981', color: '#042f2e', fontWeight: 'bold' }}>{t.badgeNew || 'NEW'}</span>
                  <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{t.newTipsTitle}</strong>
                </div>
                <div style={{ color: '#a7f3d0', fontSize: '0.8rem', marginTop: '2px' }}>
                  {t.newTipsSub}
                </div>
              </div>
            </div>
            <button className="btn-activate-tips" onClick={() => setActiveTab('tips')}>
              <span>🏷️</span> {t.activate}
            </button>
          </div>

          {/* 2. Red Alert Card */}
          <div className="banner-warning-guide" onClick={() => setShowStreamerGuideModal(true)}>
            <div className="banner-warning-icon">⚠️</div>
            <div className="banner-warning-text">
              {t.guideWarningPre || 'Para mostrar efectos a los espectadores: Sigue todos los pasos en la'}{' '}
              <span className="banner-guide-link">{t.streamerGuide}</span>
            </div>
          </div>

          {/* 3. TikTok Connect Button */}
          <div className="tiktok-connect-box">
            <button 
              className={`btn-tiktok-connect ${isConnected ? 'connected' : ''}`}
              onClick={() => setShowTikTokModal(true)}
            >
              <span>{t.connectTiktok}</span>
              <span>→</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.87-4.49V8.69a8.16 8.16 0 0 0 4.9 1.62V6.86a4.85 4.85 0 0 1-1-.17z"/>
              </svg>
            </button>
            <div className="tiktok-status-subtext">
              <span className={isConnected ? "status-dot-connected" : "status-dot-disconnected"}></span>
              <span>{isConnected ? `${t.connected} @${tiktokUser.replace('@', '')}` : t.disconnected}</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            TAB 1: MAIN DASHBOARD VIEW
            ========================================================= */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Screen Selection & Engine Section */}
            <div className="screen-selection-section">
              <div className="screen-section-header">
                <div className="screen-header-left">
                  <span style={{ fontSize: '1.5rem' }}>🖥️</span>
                  <div>
                    <div className="screen-header-title">{t.screenSelection}</div>
                    <div className="screen-header-sub">{t.screenSelectionSub}</div>
                  </div>
                </div>
                <button className="btn-screen-refresh" onClick={refreshScreens}>
                  <span>🔄</span> {t.refresh}
                </button>
              </div>

              {/* Screens Grid */}
              <div className="screens-grid">
                {screens.map((screen) => {
                  const isSelected = selectedScreenId === screen.id;
                  return (
                    <div 
                      key={screen.id}
                      className={isSelected ? "screen-card-active" : "screen-card-inactive"}
                      onClick={() => {
                        setSelectedScreenId(screen.id);
                        if (ipcRendererRef.current) {
                          ipcRendererRef.current.invoke('system:select-screen', screen.id).catch(() => {});
                        }
                        showToast(`🖥️ Pantalla seleccionada: ${screen.name}`);
                      }}
                    >
                      <div className="screen-icon-monitor">🖥️</div>
                      <div className="screen-card-name">{screen.name}</div>
                      <div className="screen-card-res">{screen.resolution}</div>
                      <div className="screen-card-pos">{screen.position}</div>
                    </div>
                  );
                })}
              </div>

              {/* Engine Switches */}
              <div className="engine-switches-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="engine-switch-item">
                  <div className="engine-switch-label">
                    <span>🎮</span>
                    <span>{t.graphicsEngine}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: graphicsEngine ? '#10b981' : '#64748b' }}>
                      {graphicsEngine ? (t.on || 'ON') : (t.off || 'OFF')}
                    </span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={graphicsEngine} 
                        onChange={(e) => setGraphicsEngine(e.target.checked)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="engine-switch-item">
                  <div className="engine-switch-label">
                    <span>⚡</span>
                    <span>{t.ultraGamingMode}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: ultraPerformanceMode ? '#38bdf8' : '#64748b' }}>
                      {ultraPerformanceMode ? '144+ FPS' : (t.off || 'OFF')}
                    </span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={ultraPerformanceMode} 
                        onChange={(e) => handleToggleUltraPerf(e.target.checked)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="engine-switch-item">
                  <div className="engine-switch-label">
                    <span>🪟</span>
                    <span>{t.desktopOverlayLabel}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: desktopOverlayActive ? '#10b981' : '#f59e0b' }}>
                      {desktopOverlayActive ? (t.on || 'ON') : 'SOLO OBS'}
                    </span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={desktopOverlayActive} 
                        onChange={(e) => handleToggleDesktopOverlay(e.target.checked)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="engine-switch-item">
                  <div className="engine-switch-label">
                    <span>📐</span>
                    <span>{t.alignmentGrid}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: alignmentGrid ? '#10b981' : '#64748b' }}>
                      {alignmentGrid ? (t.on || 'ON') : (t.off || 'OFF')}
                    </span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={alignmentGrid} 
                        onChange={(e) => setAlignmentGrid(e.target.checked)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Ultra Performance Zero-Lag Game Indicator */}
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1.25rem',
                background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.08))',
                borderRadius: '10px',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#38bdf8' }}>
                      Aceleración por GPU y Zero-Lag Gaming Activo
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      0% impacto en juegos de disparos y esports. La superposición de escritorio permanece en reposo total y no roba recursos de la GPU.
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>Sin Caída de FPS</span>
                </div>
              </div>
            </div>

            {/* Bottom Metrics Cards Row */}
            <div className="metrics-row-grid">
              <div className="metric-card-box">
                <div className="metric-header">
                  <span style={{ color: '#ec4899', fontSize: '1.2rem' }}>🎁</span>
                  <span>{t.giftsReceived}</span>
                </div>
                <div className="metric-number-big">
                  {giftsReceivedCount}
                </div>
              </div>

              <div className="metric-card-box">
                <div className="metric-header">
                  <span style={{ color: '#fbbf24', fontSize: '1.2rem' }}>⚡</span>
                  <span>{t.actionsExecuted}</span>
                </div>
                <div className="metric-number-big">
                  {actionsExecutedCount}
                </div>
              </div>

              <div className="metric-card-box">
                <div className="metric-header">
                  <span style={{ color: '#38bdf8', fontSize: '1.2rem' }}>🕒</span>
                  <span>{t.queueLength}</span>
                </div>
                <div className="metric-number-big">
                  {queueLength}
                </div>
              </div>
            </div>

            {/* Quick Live Trigger Tester directly on Dashboard */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontWeight: 'bold', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚡</span> <span>{t.quickTesterTitle || 'Probador Rápido de Regalos y Eventos'}</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {t.quickTesterSub || 'Simula regalos o eventos para ver cómo se activan tus mapeos en OBS'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-secondary"
                  title="Simula 'Rose' (nombre en inglés)"
                  onClick={() => handleIncomingGift({ user: 'Fan_USA', giftName: 'Rose', diamondCount: 1, repeatCount: 1, repeatEnd: true })}
                >
                  🌹 Rose (EN)
                </button>
                <button 
                  className="btn btn-secondary"
                  title="Simula 'Rosa' (sinónimo en español para probar matching)"
                  onClick={() => handleIncomingGift({ user: 'Fan_Latino', giftName: 'Rosa', diamondCount: 1, repeatCount: 1, repeatEnd: true })}
                >
                  🌹 Rosa (ES - Sinónimo)
                </button>
                <button 
                  className="btn btn-secondary"
                  title="Simula 'Panda' (199 monedas)"
                  onClick={() => handleIncomingGift({ user: 'PandaBoss', giftName: 'Panda', diamondCount: 199, repeatCount: 1, repeatEnd: true })}
                >
                  🐼 Panda (199 🪙)
                </button>
                <button 
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff' }}
                  title="Simula 'Lion' (en inglés, probando match con regla 'León')"
                  onClick={() => handleIncomingGift({ user: 'King_Lion', giftName: 'Lion', diamondCount: 29999, repeatCount: 1, repeatEnd: true })}
                >
                  🦁 Lion (EN ➔ León)
                </button>
                <button 
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff' }}
                  title="Simula una racha de combo de 20 rosas consecutivas"
                  onClick={() => {
                    showToast('🔥 Simulando combo en vivo de 20 Rosas...');
                    for (let i = 1; i <= 20; i++) {
                      setTimeout(() => {
                        handleIncomingGift({
                          user: 'SuperDonador',
                          giftName: 'Rose',
                          diamondCount: 1,
                          repeatCount: i,
                          repeatEnd: i === 20
                        });
                      }, i * 70);
                    }
                  }}
                >
                  💥 Combo Rose x20 (Streak)
                </button>
                <button 
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff' }}
                  onClick={() => handleIncomingEvent({ eventType: 'follow', user: 'NuevoStreamerFan' })}
                >
                  👤 Follow
                </button>
                <button 
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}
                  onClick={() => handleIncomingEvent({ eventType: 'share', user: 'ComunidadGamer' })}
                >
                  🔄 Share
                </button>
                <button 
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)', color: '#fff' }}
                  onClick={() => handleIncomingEvent({ eventType: 'likes', user: 'Espectadores', likeCount: 100 })}
                >
                  ❤️ Combo Likes
                </button>
              </div>
            </div>

            {/* Quick Activity Stream */}
            {activityFeed.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ color: '#94a3b8', marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                  📡 ÚLTIMAS ACCIONES PROCESADAS
                </h4>
                <div className="live-feed-box">
                  {activityFeed.slice(0, 5).map((item) => (
                    <div key={item.id} className="live-feed-item">
                      <div>
                        <strong style={{ color: '#60a5fa' }}>{item.time}</strong> — 
                        <span style={{ color: '#fbbf24', marginLeft: '0.4rem' }}>{item.user}</span> envió{' '}
                        <strong>{item.giftName}</strong> {item.coins > 0 && `(${item.coins} 🪙)`}
                      </div>
                      <div>
                        {item.unmatched ? (
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Sin regla</span>
                        ) : (
                          <span className="badge badge-success">
                            {item.effect} ({item.duration}s)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 2: MAPEOS DE ACCIONES (EXACT MATCH TO IMAGE 2)
            ========================================================= */}
        {activeTab === 'mappings' && (
          <div>
            {/* Header Title from Image 2 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: '#fbbf24', fontSize: '1.5rem' }}>⚡</span>
                <h1 style={{ fontSize: '1.65rem', margin: 0, color: '#fff' }}>{t.mappingsTitle || 'Mapeos de Acciones'}</h1>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                {t.mappingsSub || 'Mapea regalos y eventos de TikTok Live a efectos visuales'}
              </p>
            </div>

            {/* Navigation Pills: Regalos vs Eventos (Image 2) */}
            <div className="mappings-nav-pills">
              <button 
                className={`mapping-tab-btn ${mappingSubTab === 'gifts' ? 'active' : ''}`}
                onClick={() => setMappingSubTab('gifts')}
              >
                <span style={{ fontSize: '1.2rem' }}>🎁</span>
                <span>{t.giftsTab || 'Regalos'}</span>
                <span className="mapping-count-pill">{giftMappings.length}</span>
              </button>

              <button 
                className={`mapping-tab-btn ${mappingSubTab === 'events' ? 'active' : ''}`}
                onClick={() => setMappingSubTab('events')}
              >
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <span>{t.eventsTab || 'Eventos'}</span>
                <span className="mapping-count-pill">{eventMappings.length}</span>
              </button>
            </div>

            {/* Sub-header with text, combo controller, and + Add Mapping buttons */}
            <div className="mappings-sub-header">
              <div className="mappings-sub-text">
                {mappingSubTab === 'gifts' 
                  ? (t.giftsSubText || 'Configura qué efectos se activan cuando recibes regalos específicos o por umbral de monedas')
                  : (t.eventsSubText || 'Configura qué efectos se activan con eventos de TikTok Live (Follow, Share, Likes, etc.)')}
              </div>

              {mappingSubTab === 'gifts' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{t.combosLabel || 'Combos:'}</span>
                    <select 
                      value={comboMode}
                      onChange={(e) => handleSetComboMode(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#fbbf24', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}
                      title="Define si los efectos se activan al finalizar la racha de combo o en cada unidad de regalo recibida"
                    >
                      <option value="streak_end" style={{ background: '#0f172a' }}>{t.comboStreakEnd || 'Esperar final de racha (Recomendado)'}</option>
                      <option value="every_gift" style={{ background: '#0f172a' }}>{t.comboEveryGift || 'Ejecutar cada regalo individual'}</option>
                    </select>
                  </div>

                  <button 
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => {
                      setConfiguringTrigger({ type: 'coins', item: { name: 'Regla por Monedas', icon: '🪙', coins: 100 } });
                      setSelectedMinCoins(100);
                    }}
                    title="Crea una regla que se active con cualquier regalo que supere X monedas"
                  >
                    <span>🪙</span>
                    <span>{t.byCoins || '+ Por Monedas'}</span>
                  </button>

                  <button 
                    className="btn-add-mapping"
                    onClick={() => setShowGiftModal(true)}
                  >
                    <span>+</span>
                    <span>{t.addMapping || 'Add Mapping'}</span>
                  </button>
                </div>
              ) : (
                <button 
                  className="btn-add-mapping"
                  onClick={() => setShowEventModal(true)}
                >
                  <span>+</span>
                  <span>{t.addMapping || 'Add Mapping'}</span>
                </button>
              )}
            </div>

            {/* Content for Gifts Tab */}
            {mappingSubTab === 'gifts' && (
              <div>
                {/* =========================================================
                    OBS MAPPED GIFTS SLIDER & SPACING CONTAINER
                    ========================================================= */}
                <div className="obs-slider-config-panel">
                  <div className="obs-slider-config-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.35rem' }}>🎞️</span>
                      <div>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{t.sliderPanelTitle || 'Slider de Regalos Mapeados (OBS Overlay)'}</span>
                          <span className={`badge ${sliderConfig.enabled ? 'badge-success' : 'badge-warning'}`}>
                            {sliderConfig.enabled ? (t.activeInOBS || 'ACTIVO EN OBS') : (t.hiddenInOBS || 'OCULTO')}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          {t.sliderPanelSub || 'Espacio dedicado con carrusel animado para que tus espectadores vean qué regalo activa cada efecto'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        onClick={() => setShowSliderSettings((s) => !s)}
                      >
                        {showSliderSettings ? '🔼 Ocultar Ajustes' : '⚙️ Ajustar Estilo y Espaciado'}
                      </button>
                      <label className="switch" title="Mostrar/Ocultar Slider en OBS">
                        <input
                          type="checkbox"
                          checked={sliderConfig.enabled}
                          onChange={(e) => updateSliderConfig({ enabled: e.target.checked })}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  {/* Standalone Browser Source Link Banner */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.16), rgba(236, 72, 153, 0.16))',
                    border: '1.5px solid rgba(139, 92, 246, 0.5)',
                    borderRadius: '12px',
                    padding: '0.85rem 1.1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    margin: '1rem 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.4rem' }}>🔗</span>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>Fuente Independiente para OBS:</span>
                          <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>LISTO</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                          <code style={{ fontSize: '0.78rem', color: '#38bdf8', background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px' }}>
                            {isElectron ? 'http://127.0.0.1:18923/#/slider' : `${window.location.origin}${window.location.pathname}#/slider`}
                          </code>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>(Resolución recomendada: 1920x110)</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 'bold' }}
                        onClick={() => {
                          const url = isElectron ? 'http://127.0.0.1:18923/#/slider' : `${window.location.origin}${window.location.pathname}#/slider`;
                          navigator.clipboard.writeText(url);
                          showToast('📋 ¡Link del Slider copiado al portapapeles!');
                        }}
                      >
                        📋 Copiar Link Slider
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                        onClick={() => openSliderPopout(false)}
                      >
                        🪟 Pop-out
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                        onClick={downloadSliderDragFile}
                      >
                        📥 Archivo .html
                      </button>
                      {obsConnected && (
                        <button
                          className="btn btn-success"
                          style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', fontWeight: 'bold' }}
                          onClick={injectSliderIntoObs}
                        >
                          ⚡ Inyectar en OBS
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Live Preview Spacer & Horizontal Slider Track */}
                  {giftMappings.filter((m) => m.enabled).length > 0 && (
                    <div
                      className="obs-slider-preview-stage"
                      style={{
                        paddingTop: `${Math.min(48, Math.round(sliderConfig.spacingY / 4) + 10)}px`,
                        paddingBottom: `${Math.min(48, Math.round(sliderConfig.spacingY / 4) + 10)}px`
                      }}
                    >
                      <div className="obs-slider-preview-label">
                        <span>VISTA PREVIA EN VIVO ({sliderConfig.theme?.toUpperCase() || 'CYBER'} • {sliderConfig.mode?.toUpperCase() || 'MARQUEE'} • SEPARACIÓN {sliderConfig.gap}px • ESCALA {sliderConfig.scale || 1}x)</span>
                      </div>
                      <div className="slider-standalone-track-container" style={{ width: '100%', overflow: 'hidden', paddingTop: '10px' }}>
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
                          {[...giftMappings.filter((m) => m.enabled), ...giftMappings.filter((m) => m.enabled), ...giftMappings.filter((m) => m.enabled)].map((m, idx) => (
                            <div key={`streamer-prev-mapping-${m.id}-${idx}`} className="slider-streamer-meme-item">
                              <div className="slider-streamer-icon-wrap">
                                {m.giftImage ? (
                                  <img src={m.giftImage} alt={m.giftName} style={{ height: '76px', maxWidth: '88px', objectFit: 'contain' }} />
                                ) : (
                                  <span style={{ fontSize: '48px' }}>{m.giftIcon || '🎁'}</span>
                                )}
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
                    </div>
                  )}

                  {/* Spacing & Style Controls */}
                  {showSliderSettings && (
                    <div className="obs-slider-controls-grid">
                      <div className="obs-slider-control-box">
                        <label>Tema Visual</label>
                        <select
                          className="gift-select-dropdown"
                          value={sliderConfig.theme || 'cyber'}
                          onChange={(e) => updateSliderConfig({ theme: e.target.value })}
                        >
                          <option value="cyber">🟣 Cyber Neón (Púrpura / Cian)</option>
                          <option value="tiktok">🖤 TikTok Dark (Rojo / Cian Oficial)</option>
                          <option value="gold">🪙 Golden Luxury (Oro Brillante)</option>
                          <option value="minimal">✨ Minimal Flotante (Ultra Transparente)</option>
                        </select>
                      </div>

                      <div className="obs-slider-control-box">
                        <label>Modo de Animación</label>
                        <select
                          className="gift-select-dropdown"
                          value={sliderConfig.mode}
                          onChange={(e) => updateSliderConfig({ mode: e.target.value })}
                        >
                          <option value="marquee">🎞️ Cinta Continua (Slider Horizontal Ticker)</option>
                          <option value="spotlight">🎠 Carrusel por Tarjeta (1 por 1 con tiempo)</option>
                          <option value="static">📌 Barra Fija Centrada (Sin movimiento continuo)</option>
                        </select>
                      </div>

                      <div className="obs-slider-control-box">
                        <label>Posición en Pantalla</label>
                        <select
                          className="gift-select-dropdown"
                          value={sliderConfig.position}
                          onChange={(e) => updateSliderConfig({ position: e.target.value })}
                        >
                          <option value="top">⬆️ Arriba (Borde Superior)</option>
                          <option value="bottom">⬇️ Abajo (Borde Inferior)</option>
                        </select>
                      </div>

                      <div className="obs-slider-control-box">
                        <label>
                          Tamaño / Escala:{' '}
                          <strong style={{ color: '#ec4899' }}>{Math.round((sliderConfig.scale || 1) * 100)}%</strong>
                        </label>
                        <input
                          type="range"
                          min="0.75"
                          max="1.35"
                          step="0.05"
                          value={sliderConfig.scale || 1}
                          onChange={(e) => updateSliderConfig({ scale: Number(e.target.value) })}
                          style={{ width: '100%', accentColor: '#ec4899', cursor: 'pointer' }}
                        />
                      </div>

                      <div className="obs-slider-control-box">
                        <label>
                          Espaciado entre Regalos:{' '}
                          <strong style={{ color: '#10b981' }}>{sliderConfig.gap} px</strong>
                        </label>
                        <input
                          type="range"
                          min="8"
                          max="48"
                          step="2"
                          value={sliderConfig.gap}
                          onChange={(e) => updateSliderConfig({ gap: Number(e.target.value) })}
                          style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                        />
                      </div>

                      <div className="obs-slider-control-box">
                        <label>
                          Velocidad del Slider:{' '}
                          <strong style={{ color: '#fbbf24' }}>{sliderConfig.speed}s</strong>
                        </label>
                        <input
                          type="range"
                          min="6"
                          max="36"
                          step="2"
                          value={sliderConfig.speed}
                          onChange={(e) => updateSliderConfig({ speed: Number(e.target.value) })}
                          style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                        />
                      </div>

                      <div className="obs-slider-control-box">
                        <label>Etiqueta de Título</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            checked={sliderConfig.showBadge !== false}
                            onChange={(e) => updateSliderConfig({ showBadge: e.target.checked })}
                          />
                          <input
                            type="text"
                            className="input-field"
                            style={{ margin: 0, padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                            value={sliderConfig.badgeText || '🎁 REGALOS ACTIVOS'}
                            onChange={(e) => updateSliderConfig({ badgeText: e.target.value })}
                            placeholder="Texto de etiqueta"
                            disabled={sliderConfig.showBadge === false}
                          />
                        </div>
                      </div>

                      <div className="obs-slider-control-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                          <input
                            type="checkbox"
                            checked={sliderConfig.showOnMainOverlay === true}
                            onChange={(e) => updateSliderConfig({ showOnMainOverlay: e.target.checked })}
                          />
                          <span style={{ fontSize: '0.82rem' }}>Mostrar en Overlay Principal</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                          <input
                            type="checkbox"
                            checked={sliderConfig.showOnDesktop}
                            onChange={(e) => updateSliderConfig({ showOnDesktop: e.target.checked })}
                          />
                          <span style={{ fontSize: '0.82rem' }}>Ver también en mi monitor de PC</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {giftMappings.length === 0 ? (
                  /* Empty State Matching Image 2 */
                  <div className="mappings-empty-card">
                    <svg className="mappings-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="3" x2="6" y2="15"></line>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    <div className="mappings-empty-title">No mappings yet</div>
                    <div className="mappings-empty-sub">Create your first gift-to-effect mapping</div>
                    <button 
                      className="btn-add-mapping" 
                      style={{ marginTop: '1.25rem' }}
                      onClick={() => setShowGiftModal(true)}
                    >
                      <span>+</span> <span>Add Mapping</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    {giftMappings.map((m) => (
                      <div 
                        key={m.id} 
                        className="mapping-card-item"
                        style={editingMappingId === m.id ? {
                          borderColor: '#38bdf8',
                          background: 'rgba(15, 23, 42, 0.98)',
                          boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
                          flexDirection: 'column',
                          alignItems: 'stretch',
                          gap: '12px',
                          padding: '1.1rem 1.3rem'
                        } : undefined}
                      >
                        {editingMappingId === m.id ? (
                          /* DEDICATED CLEAN RENAME BAR - NO OVERLAPPING (Matches Image 2) */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '1.2rem' }}>🏷️</span>
                                <span style={{ fontSize: '0.86rem', color: '#fbbf24', fontWeight: 900, letterSpacing: '0.5px' }}>
                                  ESCRIBE EL TEXTO PARA EL SLIDER:
                                </span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                Regalo original: <strong style={{ color: '#fff' }}>{m.giftName}</strong>
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input
                                type="text"
                                className="input-field"
                                style={{
                                  margin: 0,
                                  padding: '10px 14px',
                                  fontSize: '0.96rem',
                                  fontWeight: 900,
                                  textTransform: 'uppercase',
                                  color: '#ffffff',
                                  background: '#020617',
                                  border: '2px solid #38bdf8',
                                  borderRadius: '8px',
                                  flex: 1,
                                  boxSizing: 'border-box'
                                }}
                                value={editingLabelText}
                                onChange={(e) => setEditingLabelText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    saveEditingMapping(m.id);
                                  }
                                  if (e.key === 'Escape') {
                                    e.preventDefault();
                                    cancelEditingMapping();
                                  }
                                }}
                                autoFocus
                                placeholder="Escribe el texto (ej: CERRAR JUEGO, APAGAR STREAM, DRUNK, BAILE)"
                              />
                              <button
                                type="button"
                                className="btn btn-success"
                                style={{
                                  padding: '10px 20px',
                                  fontSize: '0.88rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 10px rgba(34, 197, 94, 0.4)'
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  saveEditingMapping(m.id);
                                }}
                              >
                                💾 Guardar
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                style={{
                                  padding: '10px 16px',
                                  fontSize: '0.88rem',
                                  cursor: 'pointer',
                                  borderRadius: '8px'
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  cancelEditingMapping();
                                }}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="mapping-item-trigger">
                              <div className="mapping-trigger-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {m.giftImage ? (
                                  <img src={m.giftImage} alt={m.giftName} style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                                ) : (
                                  <span>{m.giftIcon || '🎁'}</span>
                                )}
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span className="mapping-trigger-title">{m.giftName}</span>
                                  <button
                                    type="button"
                                    onClick={() => startEditingMapping(m)}
                                    title="Haz clic para personalizar el texto que sale en el Slider de OBS"
                                    style={{
                                      background: 'rgba(56, 189, 248, 0.15)',
                                      border: '1px solid rgba(56, 189, 248, 0.5)',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '0.74rem',
                                      padding: '2px 8px',
                                      color: '#38bdf8',
                                      fontWeight: 800,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    ✏️ Renombrar
                                  </button>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                                  🏷️ SLIDER: "{m.customLabel ? m.customLabel.toUpperCase() : m.giftName.toUpperCase()}"
                                </div>
                                <div className="mapping-trigger-meta">
                                  <span>🪙</span> {m.minCoins} Moneda{m.minCoins > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>

                            <div className="mapping-arrow-indicator">➔</div>

                            <div className="mapping-item-action">
                              <div className="mapping-effect-badge">
                                <span>✨</span> {m.effect.toUpperCase()} ({m.duration}s)
                              </div>
                              {m.tts && <div className="mapping-tts-badge">🗣️ TTS Activo</div>}
                            </div>

                            <div className="mapping-item-controls">
                              <label className="switch" title="Activar/Desactivar">
                                <input 
                                  type="checkbox" 
                                  checked={m.enabled} 
                                  onChange={(e) => toggleGiftMapping(m.id, e.target.checked)} 
                                />
                                <span className="slider"></span>
                              </label>
                              <button 
                                className="btn btn-secondary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                onClick={() => {
                                  sendEffect(m.effect, m.duration);
                                  showToast(`👁️ Probando efecto: ${m.effect}`);
                                }}
                              >
                                👁️ Probar
                              </button>
                              <button 
                                className="btn btn-danger"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                onClick={() => deleteGiftMapping(m.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content for Events Tab */}
            {mappingSubTab === 'events' && (
              <div>
                {eventMappings.length === 0 ? (
                  <div className="mappings-empty-card">
                    <svg className="mappings-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="3" x2="6" y2="15"></line>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    <div className="mappings-empty-title">No mappings yet</div>
                    <div className="mappings-empty-sub">Create your first event-to-effect mapping</div>
                    <button 
                      className="btn-add-mapping" 
                      style={{ marginTop: '1.25rem' }}
                      onClick={() => setShowEventModal(true)}
                    >
                      <span>+</span> <span>Add Mapping</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    {eventMappings.map((m) => (
                      <div key={m.id} className="mapping-card-item">
                        <div className="mapping-item-trigger">
                          <div className="mapping-trigger-icon">
                            {m.icon || '⚡'}
                          </div>
                          <div>
                            <div className="mapping-trigger-title">{m.eventName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Evento en directo</div>
                          </div>
                        </div>

                        <div className="mapping-arrow-indicator">➔</div>

                        <div className="mapping-item-action">
                          <div className="mapping-effect-badge">
                            <span>✨</span> {m.effect.toUpperCase()} ({m.duration}s)
                          </div>
                          {m.tts && <div className="mapping-tts-badge">🗣️ TTS Activo</div>}
                        </div>

                        <div className="mapping-item-controls">
                          <label className="switch" title="Activar/Desactivar">
                            <input 
                              type="checkbox" 
                              checked={m.enabled} 
                              onChange={(e) => toggleEventMapping(m.id, e.target.checked)} 
                            />
                            <span className="slider"></span>
                          </label>
                          <button 
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => {
                              sendEffect(m.effect, m.duration);
                              showToast(`👁️ Probando efecto: ${m.effect}`);
                            }}
                          >
                            👁️ Probar
                          </button>
                          <button 
                            className="btn btn-danger"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => deleteEventMapping(m.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: TIPS & DONATIONS
            ========================================================= */}
        {activeTab === 'tips' && (
          <div className="glass-panel">
            <h2>🤍 Tips & Donations (Donaciones Externas)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Recibe dinero directo de tus fans y espectadores sin depender de las comisiones de monedas de TikTok.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="feature-card" style={{ border: '1px solid #10b981' }}>
                <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>💳 Stripe & Tarjetas</h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Acepta Visa, Mastercard y Google Pay con comisiones reducidas.
                </p>
                <button className="btn btn-success" onClick={() => showToast('✅ Integración con Stripe activada')}>
                  Conectar Stripe
                </button>
              </div>
              <div className="feature-card" style={{ border: '1px solid #38bdf8' }}>
                <h3 style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>🅿️ PayPal & Venmo</h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Permite a tu comunidad donar con un solo clic desde PayPal.
                </p>
                <button className="btn" style={{ background: '#0284c7' }} onClick={() => showToast('✅ Integración con PayPal activada')}>
                  Conectar PayPal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: CONTESTS & RAFFLES
            ========================================================= */}
        {activeTab === 'contests' && (
          <div className="glass-panel">
            <h2>🏆 Contests & Raffles (Sorteos y Torneos)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Organiza rifas automáticas entre tus donadores de regalos o espectadores del chat de TikTok.
            </p>
            <div className="feature-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
              <h3>Módulo de Sorteos Activo</h3>
              <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
                Cada rosa o regalo recibido generará tickets virtuales en tiempo real para rifas de pases de batalla o premios.
              </p>
              <button className="btn btn-secondary" onClick={() => showToast('🎉 Nuevo sorteo creado para el directo')}>
                Crear Sorteo Rápido
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: CHATBOT
            ========================================================= */}
        {activeTab === 'chatbot' && (
          <div className="glass-panel">
            <h2>🤖 Chatbot Moderador y Comandos</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Configura respuestas automáticas y comandos de chat como <code>!regalos</code>, <code>!redes</code> o <code>!troll</code>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="feature-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Comando !discord</strong>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Publica el enlace de tu comunidad de Discord</div>
                </div>
                <span className="badge badge-success">ACTIVO</span>
              </div>
              <div className="feature-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Agradecimiento Automático de Regalos</strong>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Envía un mensaje de gracias al chat al recibir rosas o leones</div>
                </div>
                <span className="badge badge-success">ACTIVO</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: GIFT GRAPHICS (ANIMACIONES EN PANTALLA)
            ========================================================= */}
        {activeTab === 'gift-graphics' && (
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.6rem' }}>🖼️</span>
                  <h1 style={{ fontSize: '1.65rem', margin: 0, color: '#fff' }}>
                    Gift Graphics (Animaciones en Pantalla)
                  </h1>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, maxWidth: '680px' }}>
                  Configura imágenes flotantes, lluvia de stickers 3D, estallidos gigantes y banners al recibir regalos específicos en TikTok Live.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                  onClick={resetDefaultGiftGraphics}
                  title="Restaura las animaciones predeterminadas"
                >
                  🔄 Restaurar por Defecto
                </button>
                <button
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #ec4899)',
                    color: '#fff',
                    fontWeight: 800,
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.92rem',
                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'
                  }}
                  onClick={openCreateGraphicModal}
                >
                  ✨ + Agregar Animación Gráfica
                </button>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span className="status-dot-connected"></span>
                <span>Las animaciones se proyectan automáticamente en tu fuente de OBS Studio al recibir cada regalo.</span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                {giftGraphics.filter((g) => g.enabled).length} de {giftGraphics.length} animaciones activas
              </span>
            </div>

            {/* Grid of Graphic Cards */}
            {giftGraphics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎨</div>
                <h3 style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>No tienes animaciones gráficas creadas</h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Crea tu primera lluvia de rosas, estallido 3D o despegue espacial con el botón de arriba.
                </p>
                <button
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #ec4899)', color: '#fff', fontWeight: 800, padding: '0.75rem 1.5rem' }}
                  onClick={openCreateGraphicModal}
                >
                  ✨ Crear mi Primera Animación
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
                {giftGraphics.map((g) => {
                  const animLabel = 
                    g.animationType === 'rain' ? '🌧️ Lluvia Cayendo' :
                    g.animationType === 'epic' ? '🦁 Rugido Épico 3D' :
                    g.animationType === 'burst' ? '💥 Estallido Central' :
                    g.animationType === 'rocket' ? '🚀 Despegue Vertical' :
                    g.animationType === 'bounce' ? '🪂 Flotante / Rebote' : '✨ Animación';

                  return (
                    <div
                      key={g.id}
                      className="gift-graphic-card"
                      style={{
                        opacity: g.enabled ? 1 : 0.6,
                        border: g.enabled ? '1.5px solid rgba(56, 189, 248, 0.3)' : '1.5px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      {/* Card Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                          {animLabel}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: g.enabled ? '#10b981' : '#64748b' }}>
                            {g.enabled ? 'ACTIVA' : 'PAUSA'}
                          </span>
                          <label className="switch" style={{ transform: 'scale(0.85)' }}>
                            <input
                              type="checkbox"
                              checked={g.enabled}
                              onChange={(e) => toggleGiftGraphic(g.id, e.target.checked)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>

                      {/* Card Center Visual */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '12px' }}>
                        {g.image ? (
                          <img src={g.image} alt={g.name} className="gift-graphic-img" />
                        ) : (
                          <div className="gift-graphic-preview-icon">{g.icon || '🎁'}</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', lineHeight: 1.2, marginBottom: '4px' }}>
                            {g.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>
                            🎁 Dispara con: {g.triggerGift || 'Cualquier regalo'} {g.triggerCoins ? `(≥ ${g.triggerCoins} 🪙)` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Specs Row */}
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '6px' }}>
                          ⏱️ {g.duration}s
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '6px' }}>
                          🎈 {g.particleCount || 20} partículas
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '6px' }}>
                          🔊 {g.sound === 'pop' ? 'Burbuja' : g.sound === 'epic' ? 'Épico' : g.sound === 'coin' ? 'Monedas' : g.sound === 'laser' ? 'Láser' : 'Silencio'}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          className="btn"
                          style={{
                            flex: 1,
                            padding: '0.55rem',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          onClick={() => testGiftGraphic(g)}
                        >
                          <span>▶</span> <span>Probar en OBS</span>
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.55rem 0.75rem', fontSize: '0.82rem' }}
                          title="Editar parámetros"
                          onClick={() => openEditGraphicModal(g)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.55rem 0.75rem', fontSize: '0.82rem' }}
                          title="Eliminar animación"
                          onClick={() => deleteGiftGraphic(g.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB: SLIDER DE REGALOS (OBS OVERLAY CAROUSEL)
            ========================================================= */}
        {activeTab === 'slider' && (
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '2.2rem' }}>🎠</span>
                  <div>
                    <h1 style={{ fontSize: '1.75rem', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>Slider de Regalos (OBS Overlay)</span>
                      <span className={`badge ${sliderConfig.enabled ? 'badge-success' : 'badge-warning'}`}>
                        {sliderConfig.enabled ? 'ACTIVO EN OBS' : 'OCULTO'}
                      </span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                      Cinta continua animada para OBS Studio y TikTok Live Studio que muestra a tu audiencia qué regalo activa cada troll o shader.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label className="switch" title="Activar/Desactivar Slider en OBS">
                  <input
                    type="checkbox"
                    checked={sliderConfig.enabled}
                    onChange={(e) => updateSliderConfig({ enabled: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: sliderConfig.enabled ? '#10b981' : '#94a3b8' }}>
                  {sliderConfig.enabled ? 'Slider Activo' : 'Slider Desactivado'}
                </span>
              </div>
            </div>

            {/* Quick OBS Action Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.16), rgba(236, 72, 153, 0.16))',
              border: '1.5px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '12px',
              padding: '1.1rem 1.3rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Fuente Exclusiva para OBS Studio / TikTok Live Studio:</span>
                  <span className="badge badge-success">1920 x 110 px</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <code style={{ fontSize: '0.85rem', color: '#38bdf8', background: 'rgba(0,0,0,0.5)', padding: '3px 10px', borderRadius: '6px' }}>
                    {isElectron ? 'http://127.0.0.1:18923/#/slider' : `${window.location.origin}${window.location.pathname}#/slider`}
                  </code>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', fontWeight: 'bold' }}
                  onClick={() => {
                    const url = isElectron ? 'http://127.0.0.1:18923/#/slider' : `${window.location.origin}${window.location.pathname}#/slider`;
                    navigator.clipboard.writeText(url);
                    showToast('📋 ¡Link del Slider copiado!');
                  }}
                >
                  📋 Copiar URL OBS
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => openSliderPopout(false)}
                >
                  🪟 Ventana Pop-out
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                  onClick={downloadSliderDragFile}
                >
                  📥 Descargar Archivo .html
                </button>
                {obsConnected && (
                  <button
                    className="btn btn-success"
                    style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem', fontWeight: 'bold' }}
                    onClick={injectSliderIntoObs}
                  >
                    ⚡ Inyectar en OBS Ahora
                  </button>
                )}
              </div>
            </div>

            {/* Live Preview Display */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>👁️ VISTA PREVIA DEL SLIDER:</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  ({giftMappings.filter((m) => m.enabled).length} regalos activos en este momento)
                </span>
              </div>

              {giftMappings.filter((m) => m.enabled).length === 0 ? (
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed #64748b', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  No tienes regalos habilitados. Ve a la pestaña <strong>⚡ Mapeos</strong> para activar regalos.
                </div>
              ) : (
                <div
                  className="obs-slider-preview-stage"
                  style={{
                    paddingTop: `${Math.min(48, Math.round(sliderConfig.spacingY / 4) + 12)}px`,
                    paddingBottom: `${Math.min(48, Math.round(sliderConfig.spacingY / 4) + 12)}px`
                  }}
                >
                  <div className="obs-slider-preview-label">
                    <span>TRACK EN TIEMPO REAL • MODO {sliderConfig.mode?.toUpperCase()} • TEMA {sliderConfig.theme?.toUpperCase()}</span>
                  </div>
                  <div className="slider-standalone-track-container" style={{ width: '100%', overflow: 'hidden', paddingTop: '10px' }}>
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
                      {[...giftMappings.filter((m) => m.enabled), ...giftMappings.filter((m) => m.enabled), ...giftMappings.filter((m) => m.enabled)].map((m, idx) => (
                        <div key={`slider-tab-${m.id}-${idx}`} className="slider-streamer-meme-item">
                          <div className="slider-streamer-icon-wrap">
                            {m.giftImage ? (
                              <img src={m.giftImage} alt={m.giftName} style={{ height: '76px', maxWidth: '88px', objectFit: 'contain' }} />
                            ) : (
                              <span style={{ fontSize: '48px' }}>{m.giftIcon || '🎁'}</span>
                            )}
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
                </div>
              )}
            </div>

            {/* Full Configuration Grid */}
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '1rem' }}>⚙️ Personalización Visual y Comportamiento</h3>
            <div className="obs-slider-controls-grid" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              <div className="obs-slider-control-box">
                <label>Tema de Colores</label>
                <select
                  className="gift-select-dropdown"
                  value={sliderConfig.theme || 'cyber'}
                  onChange={(e) => updateSliderConfig({ theme: e.target.value })}
                >
                  <option value="cyber">🟣 Cyber Neón (Púrpura / Cian)</option>
                  <option value="tiktok">🖤 TikTok Dark (Rojo / Cian Oficial)</option>
                  <option value="gold">🪙 Golden Luxury (Oro Brillante)</option>
                  <option value="minimal">✨ Minimal Flotante (Ultra Transparente)</option>
                </select>
              </div>

              <div className="obs-slider-control-box">
                <label>Modo de Animación</label>
                <select
                  className="gift-select-dropdown"
                  value={sliderConfig.mode}
                  onChange={(e) => updateSliderConfig({ mode: e.target.value })}
                >
                  <option value="marquee">🎞️ Cinta Continua (Horizontal Ticker)</option>
                  <option value="spotlight">🎠 Carrusel por Tarjeta (1 por 1 con tiempo)</option>
                  <option value="static">📌 Barra Fija Centrada (Sin movimiento continuo)</option>
                </select>
              </div>

              <div className="obs-slider-control-box">
                <label>Posición en Pantalla</label>
                <select
                  className="gift-select-dropdown"
                  value={sliderConfig.position}
                  onChange={(e) => updateSliderConfig({ position: e.target.value })}
                >
                  <option value="top">⬆️ Arriba (Borde Superior)</option>
                  <option value="bottom">⬇️ Abajo (Borde Inferior)</option>
                </select>
              </div>

              <div className="obs-slider-control-box">
                <label>
                  Tamaño / Escala:{' '}
                  <strong style={{ color: '#ec4899' }}>{Math.round((sliderConfig.scale || 1) * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={sliderConfig.scale || 1}
                  onChange={(e) => updateSliderConfig({ scale: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#ec4899', cursor: 'pointer' }}
                />
              </div>

              <div className="obs-slider-control-box">
                <label>
                  Espaciado entre Regalos:{' '}
                  <strong style={{ color: '#10b981' }}>{sliderConfig.gap} px</strong>
                </label>
                <input
                  type="range"
                  min="8"
                  max="48"
                  step="2"
                  value={sliderConfig.gap}
                  onChange={(e) => updateSliderConfig({ gap: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              <div className="obs-slider-control-box">
                <label>
                  Velocidad del Slider:{' '}
                  <strong style={{ color: '#fbbf24' }}>{sliderConfig.speed}s</strong>
                </label>
                <input
                  type="range"
                  min="6"
                  max="36"
                  step="2"
                  value={sliderConfig.speed}
                  onChange={(e) => updateSliderConfig({ speed: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
              </div>

              <div className="obs-slider-control-box">
                <label>Etiqueta de Título</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={sliderConfig.showBadge !== false}
                    onChange={(e) => updateSliderConfig({ showBadge: e.target.checked })}
                  />
                  <input
                    type="text"
                    className="input-field"
                    style={{ margin: 0, padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                    value={sliderConfig.badgeText || '🎁 REGALOS ACTIVOS'}
                    onChange={(e) => updateSliderConfig({ badgeText: e.target.value })}
                    placeholder="Texto de etiqueta"
                    disabled={sliderConfig.showBadge === false}
                  />
                </div>
              </div>

              <div className="obs-slider-control-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={sliderConfig.showOnMainOverlay === true}
                    onChange={(e) => updateSliderConfig({ showOnMainOverlay: e.target.checked })}
                  />
                  <span style={{ fontSize: '0.82rem' }}>Mostrar en Overlay Principal</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={sliderConfig.showOnDesktop}
                    onChange={(e) => updateSliderConfig({ showOnDesktop: e.target.checked })}
                  />
                  <span style={{ fontSize: '0.82rem' }}>Ver también en mi monitor de PC</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
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
        )}

        {/* =========================================================
            TAB 8: PLANES (GRATIS VS ULTIMATE)
            ========================================================= */}
        {activeTab === 'plans' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
                💎 Planes de Stream Troll
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
                Descubre las ventajas de cada nivel. Tu cuenta actual está disfrutando del plan{' '}
                <strong style={{ color: trollUser.plan === 'ULTIMATE' ? '#fde047' : '#38bdf8' }}>
                  {trollUser.plan || 'GRATUITO'}
                </strong>.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '850px', margin: '0 auto' }}>
              {/* PLAN GRATUITO */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#cbd5e1' }}>Plan Gratuito</h3>
                    <span style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
                      BÁSICO
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>
                    $0 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400 }}>/ siempre</span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#94a3b8' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> Hasta 3 mapeos simultáneos
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> Shaders visuales estándar (Drunk, Invert, Blur)
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> Conexión con TikTok Live y TikFinity
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> Slider de regalos en OBS
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> Extensible Timer básico
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
                      <span style={{ color: '#ef4444' }}>✕</span> Acciones extremas de PC bloqueadas
                    </li>
                  </ul>
                </div>

                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  {trollUser.plan !== 'ULTIMATE' ? '✅ Tu plan actual activo' : 'Disponible para invitados'}
                </div>
              </div>

              {/* PLAN ULTIMATE */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08), rgba(236, 72, 153, 0.08))',
                border: '2px solid rgba(234, 179, 8, 0.6)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(234, 179, 8, 0.15)'
              }}>
                <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff', fontSize: '0.75rem', fontWeight: 900, padding: '4px 12px', borderRadius: '20px', letterSpacing: '1px' }}>
                  PRO STREAMER
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fde047', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>👑</span> Plan ULTIMATE
                    </h3>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>
                    VIP <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 400 }}>/ Acceso Total</span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#f1f5f9' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 900 }}>★</span> <strong>Mapeos ILIMITADOS</strong> de regalos y eventos
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 900 }}>★</span> <strong>Acciones Extremas del Sistema:</strong>
                    </li>
                    <li style={{ paddingLeft: '26px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      • 🛑 Apagar Stream directo en OBS Studio
                    </li>
                    <li style={{ paddingLeft: '26px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      • ❌ Cerrar Juego en ejecución al recibir regalo
                    </li>
                    <li style={{ paddingLeft: '26px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      • 📉 Minimizar Juego / Alt+Tab
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 900 }}>★</span> <strong>Extensible Timer Pro:</strong> Conversión personalizada de monedas a segundos
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 900 }}>★</span> Shaders premium en 144+ FPS sin pérdida de rendimiento
                    </li>
                  </ul>
                </div>

                <div style={{
                  textAlign: 'center',
                  padding: '12px',
                  background: trollUser.plan === 'ULTIMATE' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  color: '#fff',
                  fontWeight: 800
                }}>
                  {trollUser.plan === 'ULTIMATE' ? '👑 Tu cuenta tiene Acceso ULTIMATE Oficial' : 'Exclusivo para la cuenta de Migue'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            UTILITY TABS: SHADERS, OVERLAY, SOUNDBOARD, ALERTAS
            ========================================================= */}
        {activeTab === 'shaders' && (
          <div className="glass-panel">
            <h2>✨ Catálogo Completo de Shaders Visuales</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Efectos temporales acelerados por hardware para alterar la transmisión de OBS. Haz clic en "Probar" para verlos en tu Overlay.
            </p>
            <div className="grid-container">
              {AVAILABLE_EFFECTS.map((eff) => (
                <div key={eff.id} className="feature-card">
                  <div className="feature-title">{eff.name}</div>
                  <button
                    className="btn btn-secondary"
                    style={{ marginTop: '1rem', width: '100%' }}
                    onClick={() => {
                      sendEffect(eff.id, 6);
                      showToast(`Enviando efecto: ${eff.id}`);
                    }}
                  >
                    Probar en Overlay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'soundboard' && (
          <div className="glass-panel">
            <h2>🔊 Soundboard Instantáneo</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Reproduce efectos de audio molestos o cómicos directamente desde el navegador o la aplicación:
            </p>
            <div className="grid-container">
              <div className="feature-card" onClick={() => playSoundEffect('screamer')}>
                <div className="feature-icon">😱</div>
                <div className="feature-title">Screamer Agudo</div>
                <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Reproducir</button>
              </div>
              <div className="feature-card" onClick={() => playSoundEffect('fbi')}>
                <div className="feature-icon">🚨</div>
                <div className="feature-title">Sirena FBI / Alarma</div>
                <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Reproducir</button>
              </div>
              <div className="feature-card" onClick={() => playSoundEffect('knock')}>
                <div className="feature-icon">🚪</div>
                <div className="feature-title">Golpe / Tocar Puerta</div>
                <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Reproducir</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overlay' && (
          <div className="glass-panel">
            <div style={{ marginBottom: '2rem' }}>
              <h2>🖥️ Fuentes de Navegador para OBS Studio & TikTok Live</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                StreamTroll cuenta con <strong>tres fuentes independientes</strong> para máxima personalización: el overlay de pantalla completa para efectos visuales, la barra animada de regalos y el cronómetro de subatón.
              </p>
            </div>

            {/* SECCIÓN 1: TRES FUENTES INDEPENDIENTES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {/* TARJETA FUENTE 1: OVERLAY PRINCIPAL */}
              <div className="feature-card" style={{ border: '1.5px solid rgba(139, 92, 246, 0.45)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(15, 23, 42, 0.6))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>🖥️</span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.18rem' }}>Fuente 1: Efectos & Shaders</h3>
                        <span style={{ fontSize: '0.74rem', color: '#a78bfa' }}>Resolución: 1920x1080 (Pantalla Completa)</span>
                      </div>
                    </div>
                    <span className="badge badge-info">PANTALLA COMPLETA</span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                    Procesa los efectos visuales como <strong>Drunk, Flashbang, Glitch, Earthquake</strong> y las alertas con sonido sobre todo el directo.
                  </p>

                  <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '3px' }}>Enlace de la Fuente:</div>
                    <code style={{ fontSize: '0.8rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                      {isElectron ? 'http://127.0.0.1:18923/#/overlay' : `${window.location.origin}${window.location.pathname}#/overlay`}
                    </code>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.7rem', fontSize: '0.82rem', fontWeight: 'bold' }}
                      onClick={() => {
                        const url = isElectron ? 'http://127.0.0.1:18923/#/overlay' : `${window.location.origin}${window.location.pathname}#/overlay`;
                        navigator.clipboard.writeText(url);
                        showToast('📋 ¡Link del Overlay copiado!');
                      }}
                    >
                      📋 Copiar Link
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.7rem', fontSize: '0.82rem' }}
                      onClick={downloadObsDragFile}
                    >
                      📥 Archivo .html
                    </button>
                  </div>

                  {obsConnected && (
                    <button
                      className="btn btn-success"
                      style={{ width: '100%', padding: '0.8rem', fontWeight: 'bold' }}
                      onClick={injectOverlayIntoObs}
                    >
                      ⚡ Inyectar en OBS (1 Clic)
                    </button>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <button
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', padding: '0.6rem', fontSize: '0.78rem' }}
                      onClick={() => openPopout(false)}
                    >
                      🪟 Pop-Out
                    </button>
                    <button
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #059669, #10b981)', padding: '0.6rem', fontSize: '0.78rem' }}
                      onClick={() => openPopout(true)}
                    >
                      🟩 Chroma Verde
                    </button>
                  </div>
                </div>
              </div>

              {/* TARJETA FUENTE 2: SLIDER DE REGALOS INDEPENDIENTE */}
              <div className="feature-card" style={{ border: '1.5px solid rgba(236, 72, 153, 0.55)', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(15, 23, 42, 0.6))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>🎠</span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#fdf2f8' }}>Fuente 2: Slider de Regalos</h3>
                        <span style={{ fontSize: '0.74rem', color: '#f472b6' }}>Resolución: 1920x110 (o 1080x95 Vertical)</span>
                      </div>
                    </div>
                    <span className="badge badge-success" style={{ background: '#ec4899' }}>SEPARADO</span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                    Barra animada continua que muestra los regalos activos y sus efectos. Puedes colocarla arriba, abajo o sobre tu webcam.
                  </p>

                  <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem', border: '1px solid rgba(236, 72, 153, 0.25)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#f472b6', marginBottom: '3px' }}>Enlace Exclusivo del Slider:</div>
                    <code style={{ fontSize: '0.8rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                      {isElectron ? 'http://127.0.0.1:18923/#/slider' : `${window.location.origin}${window.location.pathname}#/slider`}
                    </code>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.7rem', fontSize: '0.82rem', fontWeight: 'bold' }}
                      onClick={() => {
                        const url = isElectron ? 'http://127.0.0.1:18923/#/slider' : `${window.location.origin}${window.location.pathname}#/slider`;
                        navigator.clipboard.writeText(url);
                        showToast('📋 ¡Link del Slider copiado!');
                      }}
                    >
                      📋 Copiar Link Slider
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.7rem', fontSize: '0.82rem' }}
                      onClick={downloadSliderDragFile}
                    >
                      📥 Archivo .html
                    </button>
                  </div>

                  {obsConnected && (
                    <button
                      className="btn btn-success"
                      style={{ width: '100%', padding: '0.8rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ec4899, #be185d)' }}
                      onClick={injectSliderIntoObs}
                    >
                      ⚡ Inyectar Slider en OBS (1 Clic)
                    </button>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <button
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #db2777, #be185d)', padding: '0.6rem', fontSize: '0.78rem' }}
                      onClick={() => openSliderPopout(false)}
                    >
                      🪟 Pop-Out Slider
                    </button>
                    <button
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #059669, #10b981)', padding: '0.6rem', fontSize: '0.78rem' }}
                      onClick={() => openSliderPopout(true)}
                    >
                      🟩 Chroma Slider
                    </button>
                  </div>
                </div>
              </div>

              {/* TARJETA FUENTE 3: CRONÓMETRO SUBATÓN */}
              <div className="feature-card" style={{ border: '1.5px solid rgba(56, 189, 248, 0.55)', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(15, 23, 42, 0.6))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>⏱️</span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#e0f2fe' }}>Fuente 3: Cronómetro Subatón</h3>
                        <span style={{ fontSize: '0.74rem', color: '#38bdf8' }}>Resolución: 500x180 px</span>
                      </div>
                    </div>
                    <span className="badge badge-success" style={{ background: '#0284c7' }}>SUBATÓN</span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                    Reloj digital en tiempo real con diseño cyber neón que suma segundos automáticamente con regalos, follows y subs.
                  </p>

                  <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginBottom: '3px' }}>Enlace del Cronómetro:</div>
                    <code style={{ fontSize: '0.8rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                      {isElectron ? 'http://127.0.0.1:18923/#/timer' : `${window.location.origin}${window.location.pathname}#/timer`}
                    </code>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.7rem', fontSize: '0.82rem', fontWeight: 'bold' }}
                      onClick={() => {
                        const url = isElectron ? 'http://127.0.0.1:18923/#/timer' : `${window.location.origin}${window.location.pathname}#/timer`;
                        navigator.clipboard.writeText(url);
                        showToast('📋 ¡Link del Cronómetro copiado!');
                      }}
                    >
                      📋 Copiar Link Timer
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.7rem', fontSize: '0.82rem' }}
                      onClick={downloadTimerDragFile}
                    >
                      📥 Archivo .html
                    </button>
                  </div>

                  {obsConnected && (
                    <button
                      className="btn btn-success"
                      style={{ width: '100%', padding: '0.8rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
                      onClick={injectTimerIntoObs}
                    >
                      ⚡ Inyectar Timer en OBS (1 Clic)
                    </button>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <button
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', padding: '0.6rem', fontSize: '0.78rem' }}
                      onClick={() => openTimerPopout(false)}
                    >
                      🪟 Pop-Out Timer
                    </button>
                    <button
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #059669, #10b981)', padding: '0.6rem', fontSize: '0.78rem' }}
                      onClick={() => openTimerPopout(true)}
                    >
                      🟩 Chroma Timer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: CONEXIÓN AUTOMÁTICA WEBSOCKET CON OBS */}
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: '#f8fafc' }}>
              🔌 Conexión WebSocket con OBS Studio v28+
            </h3>

            <div className="feature-card" style={{ border: obsConnected ? '2px solid #10b981' : '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06), transparent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>⚡</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.15rem' }}>Servidor WebSocket de OBS</h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Permite inyectar las fuentes de navegador automáticamente con 1 solo clic</span>
                  </div>
                </div>
                <span className={`badge ${obsConnected ? 'badge-success' : 'badge-warning'}`}>
                  {obsConnected ? 'OBS CONECTADO' : 'OBS DESCONECTADO'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>Puerto WebSocket OBS (por defecto 4455)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={obsPort}
                    onChange={(e) => setObsPort(Number(e.target.value))}
                    disabled={obsConnected || obsConnecting}
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>Contraseña WebSocket (si aplica)</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Opcional"
                    value={obsPassword}
                    onChange={(e) => setObsPassword(e.target.value)}
                    disabled={obsConnected || obsConnecting}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
                <button
                  className="btn"
                  style={{ flex: 1, background: obsConnected ? '#ef4444' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))' }}
                  onClick={obsConnected ? disconnectObs : connectObs}
                  disabled={obsConnecting}
                >
                  {obsConnecting ? 'Conectando...' : obsConnected ? 'Desconectar OBS' : '🔌 Conectar con OBS'}
                </button>
              </div>

              {obsConnected && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#6ee7b7', marginBottom: '0.8rem' }}>
                    🎯 <strong>Escena Actual en OBS:</strong> <span style={{ color: '#fff' }}>"{obsSceneName || 'Escena Principal'}"</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                    <button
                      className="btn btn-success"
                      style={{ padding: '0.8rem', fontWeight: 'bold' }}
                      onClick={injectOverlayIntoObs}
                    >
                      ⚡ Inyectar Overlay (1920x1080)
                    </button>
                    <button
                      className="btn btn-success"
                      style={{ padding: '0.8rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ec4899, #be185d)' }}
                      onClick={injectSliderIntoObs}
                    >
                      ⚡ Inyectar Slider (1920x110)
                    </button>
                    <button
                      className="btn btn-success"
                      style={{ padding: '0.8rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
                      onClick={injectTimerIntoObs}
                    >
                      ⚡ Inyectar Timer (500x180)
                    </button>
                  </div>
                </div>
              )}

              {obsStatusMsg && (
                <div style={{ fontSize: '0.8rem', marginTop: '0.8rem', color: obsConnected ? '#10b981' : '#f87171' }}>
                  {obsStatusMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'alertas' && (
          <div className="glass-panel">
            <h2>💸 Alertas Falsas y Voz TTS</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Lanza notificaciones con diseño de donación o activa el narrador de voz en el directo.
            </p>
            <div className="grid-container">
              <div className="input-group">
                <label>Nombre del Donador</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej: ElonMusk"
                  value={alertUser}
                  onChange={(e) => setAlertUser(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Monto</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej: $5,000 USD"
                  value={alertAmount}
                  onChange={(e) => setAlertAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="input-group">
              <label>Mensaje que leerá el TTS</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej: Te dono esto para que compres mejores manos en el juego..."
                value={alertMsg}
                onChange={(e) => setAlertMsg(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
              <input
                type="checkbox"
                id="tts-main"
                checked={useTTS}
                onChange={(e) => setUseTTS(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="tts-main" style={{ margin: 0, fontWeight: 'bold', cursor: 'pointer' }}>
                🗣️ Activar Voz Narradora (Text-to-Speech)
              </label>
            </div>
            <button
              className="btn"
              onClick={() => {
                dispatchToOverlay({
                  type: 'ALERT',
                  user: alertUser || 'Donador Misterioso',
                  amount: alertAmount || '$100.00',
                  message: alertMsg || 'Trolleando tu directo con StreamTroll...',
                  tts: useTTS
                });
                showToast('¡Alerta enviada al Overlay!');
              }}
            >
              🚀 Lanzar Alerta al Overlay
            </button>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL 1: SELECT GIFT (TRIGGER) - EXACT MATCH TO IMAGE 1
          ========================================================= */}
      {showGiftModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowGiftModal(false)}>
          <div className="gift-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="gift-modal-header">
              <div className="gift-modal-title">
                <div className="gift-modal-title-bar"></div>
                <span>Select Gift (Trigger)</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowGiftModal(false)}>✕</button>
            </div>

            <div className="gift-search-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '0.6rem 0.9rem', borderRadius: '8px', marginBottom: '0.9rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  💡 ¿Prefieres activar con <strong>cualquier regalo</strong> según sus monedas?
                </span>
                <button 
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                  onClick={() => {
                    setShowGiftModal(false);
                    setConfiguringTrigger({ type: 'coins', item: { name: 'Regla por Monedas', icon: '🪙', coins: 100 } });
                    setSelectedMinCoins(100);
                  }}
                >
                  🪙 Mapear por Monedas (≥ X)
                </button>
              </div>

              <label className="gift-search-label">SEARCH BY NAME (ES/EN):</label>
              <input 
                type="text"
                className="gift-search-input"
                placeholder="Busca por nombre (ej: Rose, Rosa, León, Helado, Dona...)"
                value={giftSearch}
                onChange={(e) => setGiftSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="gift-filters-row">
              <div>
                <label className="gift-search-label">FILTER BY COINS:</label>
                <select 
                  className="gift-select-dropdown"
                  value={giftCoinFilter}
                  onChange={(e) => setGiftCoinFilter(e.target.value)}
                >
                  <option value="all">Todos los precios</option>
                  <option value="1">1 Moneda</option>
                  <option value="2-10">2 a 10 Monedas</option>
                  <option value="11-100">11 a 100 Monedas</option>
                  <option value="101-1000">101 a 1,000 Monedas</option>
                  <option value="1000+">Más de 1,000 Monedas</option>
                </select>
              </div>

              <div>
                <label className="gift-search-label">SORT BY:</label>
                <select 
                  className="gift-select-dropdown"
                  value={giftSortBy}
                  onChange={(e) => setGiftSortBy(e.target.value)}
                >
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            <div className="gift-catalog-grid">
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
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: SELECT EVENT (TRIGGER)
          ========================================================= */}
      {showEventModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowEventModal(false)}>
          <div className="modal-dialog-card" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div className="gift-modal-header">
              <div className="gift-modal-title">
                <div className="gift-modal-title-bar" style={{ background: '#f59e0b' }}></div>
                <span>Select Event (Trigger)</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowEventModal(false)}>✕</button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Selecciona qué evento de tu transmisión en vivo disparará los efectos visuales:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {TIKTOK_EVENTS_CATALOG.map((evt) => (
                <div 
                  key={evt.id}
                  className="feature-card"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.2rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => {
                    setConfiguringTrigger({ type: 'event', item: evt });
                    setSelectedEffect('glitch');
                    setSelectedDuration(6);
                    setSelectedTts(true);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.6rem' }}>{evt.icon}</span>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{evt.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{evt.description}</div>
                    </div>
                  </div>
                  <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>+ Elegir</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: CONFIGURE EFFECT FOR SELECTED TRIGGER
          ========================================================= */}
      {configuringTrigger && (
        <div className="modal-overlay-backdrop" onClick={() => setConfiguringTrigger(null)}>
          <div className="modal-dialog-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setConfiguringTrigger(null)}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center' }}>
                {configuringTrigger.item.image || configuringTrigger.item.giftImage ? (
                  <img src={configuringTrigger.item.image || configuringTrigger.item.giftImage} alt="" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                ) : (
                  <span>{configuringTrigger.item.icon || '🎁'}</span>
                )}
              </div>
              <h3 style={{ color: '#fff' }}>
                Asignar Efecto a: <span style={{ color: '#fbbf24' }}>{configuringTrigger.item.name}</span>
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                {configuringTrigger.type === 'gift' 
                  ? `Valor del regalo: ${configuringTrigger.item.coins} Monedas de TikTok (Soporta sinónimos ES/EN)` 
                  : configuringTrigger.type === 'coins'
                  ? 'Cualquier regalo recibido que supere o iguale el umbral de monedas'
                  : 'Evento de directo en vivo'}
              </p>
            </div>

            {configuringTrigger.type === 'coins' && (
              <div className="input-group">
                <label>Umbral de Monedas Mínimas (≥ X 🪙)</label>
                <input 
                  type="number"
                  min="1"
                  className="input-field"
                  value={selectedMinCoins}
                  onChange={(e) => setSelectedMinCoins(Math.max(1, Number(e.target.value)))}
                  placeholder="Ej: 100, 500, 1000..."
                />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                  Cualquier regalo de valor ≥ {selectedMinCoins || 100} monedas activará este efecto.
                </span>
              </div>
            )}

            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🏷️ Texto en el Slider de OBS:</span>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>(Meme / Acción)</span>
              </label>
              <input 
                type="text"
                className="input-field"
                value={selectedCustomLabel}
                onChange={(e) => setSelectedCustomLabel(e.target.value)}
                placeholder={configuringTrigger.item.name || 'Ej: CERRAR JUEGO, APAGAR STREAM, DRUNK, BAILE'}
                style={{ textTransform: 'uppercase', fontWeight: 800 }}
              />
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>
                Este texto aparecerá debajo del regalo 3D en el carrusel de OBS.
              </span>
            </div>

            <div className="input-group">
              <label>Efecto Visual (Shader)</label>
              <select 
                className="input-field"
                value={selectedEffect}
                onChange={(e) => setSelectedEffect(e.target.value)}
              >
                {AVAILABLE_EFFECTS.map((eff) => (
                  <option key={eff.id} value={eff.id}>{eff.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Duración del Efecto</label>
              <select 
                className="input-field"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
              >
                <option value={3}>3 segundos</option>
                <option value={5}>5 segundos</option>
                <option value={6}>6 segundos</option>
                <option value={8}>8 segundos</option>
                <option value={10}>10 segundos</option>
                <option value={15}>15 segundos</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <input 
                type="checkbox" 
                id="cfg-tts"
                checked={selectedTts}
                onChange={(e) => setSelectedTts(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="cfg-tts" style={{ margin: 0, fontWeight: 'bold', cursor: 'pointer', color: '#e2e8f0' }}>
                🗣️ Activar Voz Narradora (TTS) al activarse
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setConfiguringTrigger(null)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-success" 
                style={{ flex: 1.5, fontWeight: 'bold' }}
                onClick={saveNewMapping}
              >
                💾 Guardar Mapeo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: STREAM TROLL LOGIN
          ========================================================= */}
      {showTrollMeLoginModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowTrollMeLoginModal(false)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowTrollMeLoginModal(false)}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="troll-logo-retro" style={{ fontSize: '1.75rem' }}>STREAM TROLL</div>
              <h3 style={{ color: '#fff', marginTop: '0.4rem' }}>{t.trollMeModalTitle}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                {t.trollMeModalSub}
              </p>
            </div>

            <form onSubmit={loginTrollMe}>
              <div className="input-group">
                <label>Correo Electrónico</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="ejemplo@streamer.com"
                  value={trollLoginEmail}
                  onChange={(e) => setTrollLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Contraseña</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••••••"
                  value={trollLoginPass}
                  onChange={(e) => setTrollLoginPass(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn" 
                style={{ width: '100%', padding: '0.85rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #06b6d4, #ec4899)', marginBottom: '1rem' }}
              >
                🚀 Iniciar Sesión en Stream Troll
              </button>

              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}
                onClick={() => {
                  setTrollLoginEmail('miguerodriguez1008@gmail.com');
                  loginTrollMe();
                }}
              >
                👑 Acceso Rápido Cuenta Demo (miguerodriguez1008 - ULTIMATE)
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>O CONTINUAR CON</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <button className="social-login-btn" onClick={() => {
              setTrollLoginEmail('streamer_discord@trollme.gg');
              loginTrollMe();
            }}>
              <span>🎮</span> Continuar con Discord
            </button>

            <button className="social-login-btn" onClick={() => {
              setTrollLoginEmail('streamer_google@gmail.com');
              loginTrollMe();
            }}>
              <span>🌐</span> Continuar con Google
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: CREAR / EDITAR ANIMACIÓN GRÁFICA (GIFT GRAPHICS)
          ========================================================= */}
      {showGraphicModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowGraphicModal(false)}>
          <div className="modal-dialog-card" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowGraphicModal(false)}>✕</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.8rem' }}>✨</span>
              <div>
                <h2 style={{ color: '#fff', margin: 0, fontSize: '1.4rem' }}>
                  {editingGraphic ? 'Editar Animación Gráfica' : 'Nueva Animación Gráfica en Pantalla'}
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                  Configura el efecto visual animado que verán tus espectadores en OBS al donar.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveGraphicForm}>
              {/* 1. Nombre de la animación */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px' }}>
                  NOMBRE DE LA ANIMACIÓN
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej: Lluvia de Donas VIP, Rugido del León, etc."
                  value={graphicFormName}
                  onChange={(e) => setGraphicFormName(e.target.value)}
                  style={{ width: '100%', marginBottom: 0 }}
                  autoFocus
                  required
                />
              </div>

              {/* 2. Tipo de Animación */}
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  ESTILO DE ANIMACIÓN VISUAL
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'rain', label: '🌧️ Lluvia de Partículas', desc: 'Múltiples stickers cayendo del cielo' },
                    { id: 'burst', label: '💥 Estallido Central 3D', desc: 'Sticker gigante con onda dorada' },
                    { id: 'rocket', label: '🚀 Despegue Vertical', desc: 'Disparo hacia arriba con estela' },
                    { id: 'bounce', label: '🪂 Flotante / Rebote', desc: 'Flota rebotando por la pantalla' },
                    { id: 'epic', label: '🦁 Rugido Épico 3D', desc: 'Destello cinematográfico y sacudida' }
                  ].map((style) => (
                    <div
                      key={style.id}
                      onClick={() => setGraphicFormAnimType(style.id)}
                      style={{
                        padding: '10px 12px',
                        background: graphicFormAnimType === style.id ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255,255,255,0.03)',
                        border: graphicFormAnimType === style.id ? '1.5px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: graphicFormAnimType === style.id ? '#67e8f9' : '#fff' }}>
                        {style.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                        {style.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Regalo de Activación de TikTok */}
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px' }}>
                  REGALO O CONDICIÓN DE ACTIVACIÓN
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Buscar regalo en catálogo (Rose, Lion, Donut, etc.)..."
                    value={graphicCatalogSearch}
                    onChange={(e) => setGraphicCatalogSearch(e.target.value)}
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Min. monedas"
                    value={graphicFormTriggerCoins}
                    onChange={(e) => setGraphicFormTriggerCoins(e.target.value)}
                    style={{ width: '130px', marginBottom: 0 }}
                    title="Mínimo de monedas para activar"
                  />
                </div>

                {/* Quick gift pills picker */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', flexWrap: 'wrap', maxHeight: '110px' }}>
                  {TIKTOK_GIFTS_CATALOG
                    .filter((gift) => !graphicCatalogSearch || gift.name.toLowerCase().includes(graphicCatalogSearch.toLowerCase()))
                    .slice(0, 16)
                    .map((gift) => (
                      <button
                        type="button"
                        key={gift.id}
                        onClick={() => {
                          setGraphicFormTriggerGift(gift.name);
                          setGraphicFormTriggerCoins(Number(gift.price || 1));
                          if (gift.image) setGraphicFormImage(gift.image);
                          if (!graphicFormName) setGraphicFormName(`Efecto ${gift.name}`);
                        }}
                        style={{
                          background: graphicFormTriggerGift === gift.name ? 'rgba(234, 179, 8, 0.25)' : 'rgba(255,255,255,0.05)',
                          border: graphicFormTriggerGift === gift.name ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          color: '#fff',
                          fontSize: '0.78rem'
                        }}
                      >
                        {gift.image ? <img src={gift.image} alt={gift.name} style={{ width: '18px', height: '18px', objectFit: 'contain' }} /> : '🎁'}
                        <span>{gift.name}</span>
                        <span style={{ color: '#fbbf24', fontSize: '0.7rem' }}>{gift.price}🪙</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* 4. Ícono / Imagen Personalizada */}
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px' }}>
                  ÍCONO O URL DE IMAGEN / GIF TRANSPARENTE
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Quick emojis */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['🌹', '🦁', '🍩', '🚀', '💖', '👑', '🪙', '🐼'].map((emo) => (
                      <button
                        type="button"
                        key={emo}
                        onClick={() => {
                          setGraphicFormIcon(emo);
                        }}
                        style={{
                          fontSize: '1.3rem',
                          background: graphicFormIcon === emo ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.06)',
                          border: graphicFormIcon === emo ? '1px solid #38bdf8' : 'none',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          cursor: 'pointer'
                        }}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="O pega URL de imagen WebP / PNG / GIF transparente..."
                    value={graphicFormImage}
                    onChange={(e) => setGraphicFormImage(e.target.value)}
                    style={{ flex: 1, marginBottom: 0, fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              {/* 5. Sliders: Duración y Partículas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px' }}>
                    DURACIÓN ({graphicFormDuration}s)
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={graphicFormDuration}
                    onChange={(e) => setGraphicFormDuration(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px' }}>
                    PARTÍCULAS ({graphicFormParticleCount})
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={graphicFormParticleCount}
                    onChange={(e) => setGraphicFormParticleCount(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px' }}>
                    SONIDO
                  </label>
                  <select
                    className="input-field"
                    value={graphicFormSound}
                    onChange={(e) => setGraphicFormSound(e.target.value)}
                    style={{ width: '100%', marginBottom: 0, padding: '8px 10px' }}
                  >
                    <option value="pop">🫧 Burbuja / Pop</option>
                    <option value="epic">🎺 Fanfarria Épica</option>
                    <option value="coin">🪙 Monedas de Oro</option>
                    <option value="laser">⚡ Sonido Láser</option>
                    <option value="silent">🔇 Sin Sonido</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowGraphicModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #ec4899)', color: '#fff', fontWeight: 800, padding: '0.65rem 1.5rem' }}
                >
                  💾 Guardar Animación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: TIKTOK LOGIN & CONNECT
          ========================================================= */}
      {showTikTokModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowTikTokModal(false)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowTikTokModal(false)}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: '#000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                border: '2px solid #06b6d4',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.87-4.49V8.69a8.16 8.16 0 0 0 4.9 1.62V6.86a4.85 4.85 0 0 1-1-.17z"/>
                </svg>
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.35rem' }}>{t.tiktokModalTitle}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                {t.tiktokModalSub}
              </p>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#67e8f9', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                {t.tiktokOfficialTitle || '🌐 Conexión oficial de Streamer'}
              </div>
              <button 
                className="btn" 
                style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4, #ec4899)', fontWeight: 'bold', padding: '0.85rem' }}
                onClick={openOfficialTikTokLogin}
              >
                🚀 {t.openOfficialTiktok}
              </button>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                {t.tiktokOfficialNote || 'Abre la ventana oficial segura para escanear código QR o ingresar con contraseña'}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                {t.tiktokLiveLabel || '🎯 Conexión a Directo de TikTok en Vivo'}
              </label>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="@tu_usuario_de_tiktok" 
                  value={tiktokUser}
                  onChange={(e) => setTiktokUser(e.target.value)}
                  style={{ marginBottom: 0, flex: 1 }}
                />
                <button 
                  className="btn"
                  style={{ background: isConnected ? '#ef4444' : '#10b981', minWidth: '120px' }}
                  onClick={isConnected ? disconnectTikTok : connectTikTok}
                  disabled={isConnecting}
                >
                  {isConnecting ? (t.tiktokConnectingBtn || 'Conectando...') : isConnected ? (t.tiktokDisconnectBtn || 'Desconectar') : (t.tiktokConnectBtn || 'Conectar')}
                </button>
              </div>
              {connectionStatus && (
                <div style={{ fontSize: '0.8rem', marginTop: '8px', color: isConnected ? '#10b981' : '#f87171' }}>
                  {connectionStatus}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              {t.orUseOptions}
            </div>

            <button className="social-login-btn" onClick={openOfficialTikTokLogin}>
              <span>📱</span> Usar código QR (TikTok App)
            </button>
            <button className="social-login-btn" onClick={openOfficialTikTokLogin}>
              <span>👤</span> Usar teléfono, correo electrónico o usuario
            </button>
            <button className="social-login-btn" onClick={openOfficialTikTokLogin}>
              <span>🔵</span> Continuar con Facebook
            </button>
            <button className="social-login-btn" onClick={openOfficialTikTokLogin}>
              <span>🔴</span> Continuar con Google
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: STREAMER GUIDE
          ========================================================= */}
      {showStreamerGuideModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowStreamerGuideModal(false)}>
          <div className="modal-dialog-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowStreamerGuideModal(false)}>✕</button>

            <h2 style={{ color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📖</span> {t.guideModalTitle || `${t.streamerGuide} (Guía Rápida)`}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {t.guideModalSub || 'Sigue estos 4 pasos para mostrar los efectos y shaders a tus espectadores en tiempo real:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #38bdf8' }}>
                <strong style={{ color: '#38bdf8' }}>{t.guideStep1Title || 'Paso 1: Iniciar Sesión en TikTok y Stream Troll'}</strong>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                  {t.guideStep1Desc || 'Haz clic en el botón "Conectar TikTok" arriba a la derecha e ingresa tu usuario para escuchar regalos.'}
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
                <strong style={{ color: '#10b981' }}>{t.guideStep2Title || 'Paso 2: Elegir tu Pantalla de Captura'}</strong>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                  {t.guideStep2Desc || 'Selecciona la pantalla donde juegas para que el motor gráfico aplique los shaders.'}
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
                <strong style={{ color: '#f59e0b' }}>{t.guideStep3Title || 'Paso 3: Agregar la fuente de Navegador en OBS'}</strong>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                  {t.guideStep3Desc || 'Copia el enlace del Overlay o del Slider e ingrésalo como Navegador en OBS Studio.'}
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #ec4899' }}>
                <strong style={{ color: '#ec4899' }}>{t.guideStep4Title || 'Paso 4: ¡Disfrutar el Stream!'}</strong>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                  {t.guideStep4Desc || 'Cada vez que recibas un regalo, el shader y los sonidos se activarán automáticamente.'}
                </p>
              </div>
            </div>

            <button 
              className="btn btn-success" 
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', fontWeight: 'bold' }}
              onClick={() => setShowStreamerGuideModal(false)}
            >
              {t.guideCloseBtn || '¡Entendido, vamos a transmitir! 🚀'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
