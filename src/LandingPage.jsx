import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const downloadUrl = "https://github.com/MigueAngel1109/StreamTroll/releases/download/StreamTroll/StreamTroll.Setup.1.2.2.exe";
  const [activeFaq, setActiveFaq] = useState(null);
  const [copiedObs, setCopiedObs] = useState(false);
  const [copiedSlider, setCopiedSlider] = useState(false);
  const [copiedTimer, setCopiedTimer] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleCopy = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="landing-wrapper">
      {/* 1. Top Announcement Bar */}
      <div className="landing-announcement">
        <span className="badge-pill">NUEVA VERSIÓN 1.2.2</span>
        <span>⚡ Modo Ultra Gaming activo: 0% caída de FPS en juegos competitivos & integración nativa con TikTok Live</span>
        <a href={downloadUrl} className="announcement-link">Descargar Ahora →</a>
      </div>

      <div className="landing-container">
        {/* 2. Glassmorphic Navigation Header */}
        <header className="landing-header">
          <Link to="/" className="landing-logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">StreamTroll</span>
            <span className="logo-badge">PRO</span>
          </Link>

          <nav className="landing-nav-links">
            <a href="#caracteristicas" className="nav-link">Características</a>
            <a href="#guia-streamer" className="nav-link highlight-nav">📖 Guía del Streamer</a>
            <a href="#obs-integration" className="nav-link">OBS Studio</a>
            <a href="#faq" className="nav-link">Preguntas</a>
            <Link to="/legal" className="nav-link">Legal</Link>
          </nav>

          <div className="landing-nav-actions">
            <Link to="/dashboard" className="btn-nav-demo">
              🎮 Abrir Web App
            </Link>
            <a href={downloadUrl} className="btn-nav-download">
              ⬇️ Descargar .EXE
            </a>
          </div>
        </header>

        {/* 3. Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-content">
            <div className="hero-tag">
              <span className="hero-tag-dot"></span>
              <span>HERRAMIENTA #1 PARA TIKTOK LIVE & OBS STUDIO</span>
            </div>

            <h1>Trollea tu Stream al Siguiente Nivel</h1>
            <p className="hero-subtitle">
              Convierte las donaciones de tu directo en <strong>shaders en tiempo real</strong>, 
              <strong> lluvia de regalos 3D</strong>, <strong>carrusel slider de donadores</strong> y 
              <strong> temporizador extensible</strong> sin perder ni un solo FPS en tus partidas.
            </p>

            <div className="landing-cta-group">
              <a href={downloadUrl} className="landing-btn-primary">
                <span style={{ fontSize: '1.4rem' }}>🚀</span>
                <div>
                  <div style={{ fontWeight: 800 }}>Descargar para Windows</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Versión 1.2.2 Oficial • 64-bit Gratis</div>
                </div>
              </a>
              <Link to="/dashboard" className="landing-btn-secondary">
                <span>🎮 Probar App Web Directo</span>
              </Link>
            </div>

            <div className="hero-specs-row">
              <div className="spec-item">
                <span className="spec-check">✓</span> Windows 10 & 11
              </div>
              <div className="spec-item">
                <span className="spec-check">✓</span> 0% lag en Valorant/CS2/Fortnite
              </div>
              <div className="spec-item">
                <span className="spec-check">✓</span> Sin contraseñas de TikTok
              </div>
            </div>
          </div>

          {/* Interactive Live Preview Mockup */}
          <div className="landing-mockup-box">
            <div className="mockup-header">
              <div className="mockup-traffic-lights">
                <span className="traffic-dot red"></span>
                <span className="traffic-dot yellow"></span>
                <span className="traffic-dot green"></span>
              </div>
              <div className="mockup-title">StreamTroll Engine • Live Feed</div>
              <span className="mockup-status-live">● EN VIVO</span>
            </div>

            <div className="landing-terminal">
              <div className="terminal-line">
                <span className="term-dim">[00:01]</span> <span className="term-green">✔ Motor Gráfico GPU:</span> <span className="term-cyan">Aceleración 144Hz Activa</span>
              </div>
              <div className="terminal-line">
                <span className="term-dim">[00:02]</span> <span className="term-purple">⚡ Conexión TikTok Live:</span> <span className="term-yellow">@tu_usuario Conectado</span>
              </div>
              <div className="terminal-line alert-line">
                <span className="term-dim">[00:03]</span> 🎁 <strong>@streamer_fan</strong> envió <strong style={{ color: '#fbbf24' }}>León 🦁 (29,999 monedas)</strong>
              </div>
              <div className="terminal-line effect-line">
                <span className="term-dim">[00:04]</span> 💥 <em>Lanzando Shader:</em> <strong style={{ color: '#f87171' }}>FLASHBANG WHITE SHOCK</strong>
              </div>
              <div className="terminal-line audio-line">
                <span className="term-dim">[00:05]</span> 🗣️ <em>TTS Audio:</em> "¡Gracias por ese León épico, te quedaste ciego!"
              </div>
              <div className="terminal-line slider-line">
                <span className="term-dim">[00:06]</span> ⏳ <em>Subathon Timer:</em> <span style={{ color: '#34d399' }}>+15 Minutos añadidos</span>
              </div>
            </div>

            <div className="mockup-badges-grid">
              <div className="mockup-badge">
                <span style={{ fontSize: '1.2rem' }}>🎮</span>
                <div>
                  <div className="badge-stat">144+ FPS</div>
                  <div className="badge-sub">Zero Lag Gaming</div>
                </div>
              </div>
              <div className="mockup-badge">
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <div>
                  <div className="badge-stat">&lt; 50ms</div>
                  <div className="badge-sub">Latencia en Vivo</div>
                </div>
              </div>
              <div className="mockup-badge">
                <span style={{ fontSize: '1.2rem' }}>🎁</span>
                <div>
                  <div className="badge-stat">980+</div>
                  <div className="badge-sub">Regalos TikTok</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Stats Counter Bar */}
        <section className="stats-bar-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Sin Caída de FPS en Juegos</div>
              <div className="stat-desc">Aceleración por GPU y reposo automático</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">980+</div>
              <div className="stat-label">Regalos Soportados</div>
              <div className="stat-desc">Catálogo oficial completo con nombres en ES, EN y PT</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1-Clic</div>
              <div className="stat-label">Conexión con TikTok</div>
              <div className="stat-desc">Ingresa tu @usuario sin dar contraseñas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">OBS Studio</div>
              <div className="stat-label">Browser Source Directo</div>
              <div className="stat-desc">Compatible con OBS 28+, Streamlabs y Prism</div>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. GUÍA DEL STREAMER PASO A PASO (SECCIÓN PRINCIPAL)
            ========================================================= */}
        <section id="guia-streamer" className="streamer-guide-section">
          <div className="section-header-center">
            <div className="section-pill">MANUAL OFICIAL PASO A PASO</div>
            <h2>Guía Definitiva para Streamers</h2>
            <p>Configura StreamTroll en menos de 3 minutos y empieza a monetizar tus directos hoy mismo.</p>
          </div>

          <div className="guide-steps-timeline">
            {/* Step 1 */}
            <div className="guide-step-card">
              <div className="step-number-bubble">01</div>
              <div className="step-content">
                <div className="step-icon-header">
                  <span className="step-icon">💻</span>
                  <h3>Descarga e Instala la App</h3>
                </div>
                <p>
                  Descarga el instalador oficial de Windows (<code>StreamTroll Setup 1.2.2.exe</code>). 
                  Se instalará automáticamente en tu equipo sin necesidad de software adicional ni configuraciones complejas.
                </p>
                <div className="step-tip">
                  💡 <strong>Tip de Rendimiento:</strong> StreamTroll viene configurado por defecto con aceleración por hardware en GPU para no interferir con juegos exigentes.
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="guide-step-card">
              <div className="step-number-bubble">02</div>
              <div className="step-content">
                <div className="step-icon-header">
                  <span className="step-icon">🔗</span>
                  <h3>Conecta tu TikTok Live (Sin Contraseña)</h3>
                </div>
                <p>
                  Abre StreamTroll y en el campo de conexión escribe tu nombre de usuario público de TikTok (ejemplo: <code>@tu_canal</code>) y pulsa <strong>Conectar</strong>.
                </p>
                <div className="step-highlight-box">
                  🛡️ <strong>100% Seguro:</strong> Nunca te pediremos contraseña ni acceso a tu cuenta. La conexión se realiza a través de la sala pública de eventos en tiempo real.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="guide-step-card active-step">
              <div className="step-number-bubble">03</div>
              <div className="step-content">
                <div className="step-icon-header">
                  <span className="step-icon">🎥</span>
                  <h3>Integra la Fuente en OBS Studio o TikTok Live Studio</h3>
                </div>
                <p>
                  Tanto en <strong>OBS Studio</strong> como en el software oficial <strong>TikTok Live Studio</strong>, añade una fuente de tipo <strong>Navegador / Enlace (Browser Source)</strong> con resolución <strong>1920x1080</strong> y pega la URL correspondiente:
                </p>

                {/* Platform Selection Badges */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    ✓ Compatible con OBS Studio v28+
                  </span>
                  <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                    ✓ Compatible con TikTok Live Studio Oficial
                  </span>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    ✓ Streamlabs & Prism Live
                  </span>
                </div>

                {/* URLs Copy Boxes */}
                <div className="obs-urls-container">
                  <div className="obs-url-row">
                    <div className="obs-url-info">
                      <span className="obs-url-tag" style={{ color: '#38bdf8' }}>Efectos, Shaders y Trolls (TikTok Studio & OBS):</span>
                      <code className="obs-url-code">https://stream-troll.vercel.app/overlay</code>
                    </div>
                    <button 
                      className="btn-copy-code"
                      onClick={() => handleCopy('https://stream-troll.vercel.app/overlay', setCopiedObs)}
                    >
                      {copiedObs ? '✅ Copiado' : '📋 Copiar Enlace'}
                    </button>
                  </div>

                  <div className="obs-url-row">
                    <div className="obs-url-info">
                      <span className="obs-url-tag" style={{ color: '#ec4899' }}>Carrusel Slider de Regalos (TikTok Studio & OBS):</span>
                      <code className="obs-url-code">https://stream-troll.vercel.app/slider</code>
                    </div>
                    <button 
                      className="btn-copy-code"
                      onClick={() => handleCopy('https://stream-troll.vercel.app/slider', setCopiedSlider)}
                    >
                      {copiedSlider ? '✅ Copiado' : '📋 Copiar Enlace'}
                    </button>
                  </div>

                  <div className="obs-url-row">
                    <div className="obs-url-info">
                      <span className="obs-url-tag" style={{ color: '#34d399' }}>Temporizador Subathon (TikTok Studio & OBS):</span>
                      <code className="obs-url-code">https://stream-troll.vercel.app/timer</code>
                    </div>
                    <button 
                      className="btn-copy-code"
                      onClick={() => handleCopy('https://stream-troll.vercel.app/timer', setCopiedTimer)}
                    >
                      {copiedTimer ? '✅ Copiado' : '📋 Copiar Enlace'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div className="obs-recommended-settings">
                    <strong style={{ color: '#38bdf8' }}>⚙️ Configuración en OBS Studio:</strong>
                    <ul>
                      <li>Añadir fuente ➔ <strong>Navegador</strong></li>
                      <li>Ancho: <code>1920</code> | Alto: <code>1080</code></li>
                      <li>Activar: <em>"Controlar audio vía OBS"</em></li>
                    </ul>
                  </div>
                  <div className="obs-recommended-settings">
                    <strong style={{ color: '#ec4899' }}>🎵 Configuración en TikTok Live Studio:</strong>
                    <ul>
                      <li>En tu escena ➔ <strong>+ Añadir Fuente</strong></li>
                      <li>Seleccionar ➔ <strong>Enlace (Custom Link / Navegador)</strong></li>
                      <li>Pega el enlace con resolución <code>1920 x 1080</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="guide-step-card">
              <div className="step-number-bubble">04</div>
              <div className="step-content">
                <div className="step-icon-header">
                  <span className="step-icon">🎯</span>
                  <h3>Personaliza Regalos, Trolls y Sonidos</h3>
                </div>
                <p>
                  En la pestaña <strong>Mappings</strong> del Dashboard, elige qué regalo de TikTok activa cada reacción:
                </p>
                <div className="mappings-mini-preview">
                  <div className="mini-mapping-row">
                    <span>🌹 Rosa (1 moneda)</span> ➔ <span style={{ color: '#38bdf8' }}>Lluvia de Rosas 3D + Alerta TTS</span>
                  </div>
                  <div className="mini-mapping-row">
                    <span>🍩 Donas (30 monedas)</span> ➔ <span style={{ color: '#ec4899' }}>Shader Terremoto 8.0</span>
                  </div>
                  <div className="mini-mapping-row">
                    <span>🦁 León (29,999 monedas)</span> ➔ <span style={{ color: '#fbbf24' }}>Flashbang Épico + Rugido 3D + Sonido Troll</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="guide-step-card">
              <div className="step-number-bubble">05</div>
              <div className="step-content">
                <div className="step-icon-header">
                  <span className="step-icon">🚀</span>
                  <h3>Prueba en Vivo y ¡Listo para Transmitir!</h3>
                </div>
                <p>
                  Usa el <strong>Probador Rápido</strong> en el Dashboard para simular regalos de prueba antes de salir al aire. 
                  Verás cómo aparecen los efectos de inmediato en OBS Studio. ¡Inicia tu directo y diviértete con tu comunidad!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Features Grid Section */}
        <section id="caracteristicas" className="features-section">
          <div className="section-header-center">
            <div className="section-pill">TECNOLOGÍA DE VANGUARDIA</div>
            <h2>Todo lo que Necesitas para tu Stream</h2>
            <p>Diseñado exclusivamente para creadores que quieren maximizar su interacción y entretenimiento.</p>
          </div>

          <div className="landing-features">
            <div className="landing-feature-card">
              <div className="card-top-icon">💥</div>
              <h3>9 Shaders Extremos por GPU</h3>
              <p>
                <strong>Flashbang</strong> que ciega la pantalla en blanco, <strong>Terremoto 9.0</strong> con sacudida violenta, <strong>Drunk Mode</strong>, <strong>Cyber Glitch</strong>, <strong>Game Boy 8-bit</strong>, <strong>Miopía Blur</strong>, <strong>Invert Colores</strong> y <strong>Vintage Sepia</strong>. Todo renderizado a bajo nivel en WebGL con 0% carga de CPU.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="card-top-icon">🎭</div>
              <h3>Trolls de Pantalla y Acciones</h3>
              <p>
                <strong>¡Stream Caído Falso!</strong> con estática de televisión y pitido de desconexión, <strong>Cerrar Juego (Alt+F4)</strong>, <strong>Mandar al Escritorio (Win+D)</strong>, <strong>Alt+Tab Troll</strong> y <strong>Apagar Stream</strong>. Tus donadores tendrán el control total de tus partidas.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="card-top-icon">😱</div>
              <h3>Soundboard y Sustos en Vivo</h3>
              <p>
                Efectos de audio sintetizados al instante para asustar al streamer: <strong>Screamer Agudo</strong>, <strong>Sirena del FBI / Policía</strong>, <strong>Golpe a la Puerta (Knock)</strong> y disparos láser que suenan directamente por OBS y TikTok Live Studio.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="card-top-icon">🎠</div>
              <h3>Slider Carousel de Donadores</h3>
              <p>
                Barra continua animada tipo ticker para colocar arriba, abajo o sobre tu webcam. Muestra en vivo los avatares de tus donadores, el regalo enviado y las monedas acumuladas en tiempo real.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="card-top-icon">⏳</div>
              <h3>Subathon Timer Extensible</h3>
              <p>
                Cronómetro digital cyber neón que suma automáticamente segundos o minutos por cada moneda o regalo recibido. Ideal para directos maratónicos y metas de comunidad.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="card-top-icon">🖼️</div>
              <h3>Gift Graphics 3D</h3>
              <p>
                Animaciones flotantes en pantalla completa: <strong>Lluvia de rosas 3D</strong> cayendo en cascada, <strong>Rugido del León épico</strong>, despegues de cohetes espaciales y estallidos de fuegos artificiales.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="card-top-icon">🗣️</div>
              <h3>Text-to-Speech (TTS) & Alertas</h3>
              <p>
                Voz robótica nativa que lee en voz alta los nombres y mensajes de los donadores. Personaliza plantillas de texto como <em>"¡Gracias @usuario por el Regalo!"</em> sin retardos.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="card-top-icon">🎵</div>
              <h3>TikTok Live Studio & OBS Studio</h3>
              <p>
                Integración dual lista para usar. Funciona con la aplicación oficial <strong>TikTok Live Studio</strong> para PC y con <strong>OBS Studio / Streamlabs</strong> mediante fuentes de navegador de ultra baja latencia.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="card-top-icon">⚡</div>
              <h3>Modo Ultra FPS Gaming (Zero Lag)</h3>
              <p>
                Garantiza que puedas competir a 144Hz o 240Hz en títulos como Valorant, CS2 o Fortnite sin micro-tirones. La superposición permanece en reposo total cuando no hay efectos activos.
              </p>
            </div>
          </div>
        </section>

        {/* 7. OBS Integration Deep-Dive Banner */}
        <section id="obs-integration" className="obs-banner-section">
          <div className="obs-banner-card">
            <div className="obs-banner-left">
              <span className="obs-chip">INTEGRACIÓN OFICIAL OBS</span>
              <h2>Potencia tu transmisión con OBS Studio</h2>
              <p>
                StreamTroll genera automáticamente URLs locales de alto rendimiento protegidas contra caídas de internet. 
                Si tu conexión sufre una intermitencia, los gráficos y efectos continúan funcionando localmente en tu PC.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <a href="#guia-streamer" className="landing-btn-primary" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
                  📖 Ver Pasos de Configuración
                </a>
                <Link to="/dashboard" className="landing-btn-secondary" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
                  🎮 Abrir Panel de Control
                </Link>
              </div>
            </div>
            <div className="obs-banner-right">
              <div className="obs-hud-card">
                <div className="hud-title">📡 Estado del Servidor Local</div>
                <div className="hud-stat-row">
                  <span>Puerto HTTP Local:</span> <strong>18923</strong>
                </div>
                <div className="hud-stat-row">
                  <span>Fuente Browser Source:</span> <span style={{ color: '#10b981' }}>Activa</span>
                </div>
                <div className="hud-stat-row">
                  <span>Aceleración por GPU:</span> <span style={{ color: '#38bdf8' }}>Habilitada</span>
                </div>
                <div className="hud-stat-row">
                  <span>Caché en Memoria RAM:</span> <span style={{ color: '#ec4899' }}>Instantáneo (0 I/O)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Interactive FAQ Section */}
        <section id="faq" className="faq-section">
          <div className="section-header-center">
            <div className="section-pill">RESOLVEMOS TUS DUDAS</div>
            <h2>Preguntas Frecuentes de Streamers</h2>
            <p>Todo lo que necesitas saber antes de empezar a usar StreamTroll.</p>
          </div>

          <div className="faq-accordion-list">
            {[
              {
                q: "¿StreamTroll me bajará los FPS de mis juegos mientras hago directo?",
                a: "No. StreamTroll está diseñado con aceleración por hardware WebGL y reposo total del compositor de Windows (DWM). La superposición no consume recursos mientras no hay efectos activos, permitiendo mantener 144+ FPS estables en títulos como Valorant, CS2 o Fortnite."
              },
              {
                q: "¿Necesito darle mi contraseña de TikTok a la aplicación?",
                a: "No, nunca. StreamTroll solo necesita tu nombre de usuario público (ej. @tu_canal). La app se conecta al feed público de eventos de tu directo de TikTok sin requerir credenciales ni permisos de tu cuenta."
              },
              {
                q: "¿Cómo se añaden las alertas y shaders a OBS Studio?",
                a: "Solo debes crear una fuente de 'Navegador' (Browser Source) en OBS y colocar la URL local 'http://127.0.0.1:18923/#/overlay' con resolución 1920x1080. También puedes usar la superposición de escritorio si prefieres que se proyecte directo sobre tu pantalla."
              },
              {
                q: "¿Puedo probar los efectos antes de empezar mi directo?",
                a: "Sí. Dentro del Dashboard cuentas con la herramienta 'Probador Rápido de Regalos y Eventos' con la que puedes simular cualquier regalo (rosas, león, donas) para verificar el audio y los efectos visuales antes de transmitir."
              },
              {
                q: "¿Funciona si uso TikTok Live Studio en vez de OBS?",
                a: "Sí. StreamTroll incluye el modo 'Superposición de Escritorio Transparente' que dibuja los efectos directamente sobre la pantalla de tu juego, por lo que funciona tanto con OBS Studio como con TikTok Live Studio, Twitch o YouTube."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item-card ${activeFaq === index ? 'faq-item-open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question-header">
                  <span className="faq-question-text">{faq.q}</span>
                  <span className="faq-chevron">{activeFaq === index ? '−' : '+'}</span>
                </div>
                {activeFaq === index && (
                  <div className="faq-answer-body">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 9. Final Call to Action */}
        <section className="final-cta-section">
          <div className="final-cta-card">
            <h2>¿Listo para Revolucionar tus Directos?</h2>
            <p>
              Únete a los streamers que ya aumentaron sus donaciones y entretienen a su audiencia con reacciones en tiempo real.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <a href={downloadUrl} className="landing-btn-primary" style={{ padding: '1.1rem 2.5rem' }}>
                🚀 Descargar StreamTroll para Windows (Gratis)
              </a>
              <Link to="/dashboard" className="landing-btn-secondary" style={{ padding: '1.1rem 2.2rem' }}>
                🎮 Abrir Aplicación Web
              </Link>
            </div>
          </div>
        </section>

        {/* 10. Legal & Compliance Footer */}
        <footer className="landing-footer">
          <div className="footer-links-row">
            <Link to="/legal?doc=terms" className="footer-legal-link">
              📜 Términos y Condiciones
            </Link>
            <span className="footer-dot">•</span>
            <Link to="/legal?doc=privacy" className="footer-legal-link">
              🔒 Política de Privacidad
            </Link>
            <span className="footer-dot">•</span>
            <Link to="/legal?doc=disclaimer" className="footer-legal-link">
              ⚠️ Aviso Legal & Deslinde (TikTok / OBS)
            </Link>
            <span className="footer-dot">•</span>
            <Link to="/legal?doc=refunds" className="footer-legal-link">
              💳 Reembolsos y Facturación
            </Link>
            <span className="footer-dot">•</span>
            <Link to="/legal?doc=cookies" className="footer-legal-link">
              🍪 Política de Cookies
            </Link>
          </div>

          <p className="footer-copy">
            &copy; 2026 StreamTroll. Desarrollado y operado legalmente por <strong style={{ color: '#fbbf24' }}>ZENIC S.A.S</strong>. Todos los derechos reservados.
          </p>
          <p className="footer-disclaimer">
            Aviso de Exención de Responsabilidad: StreamTroll es una solución de software independiente desarrollada por ZENIC S.A.S. No tiene ninguna relación oficial, respaldo, patrocinio ni está administrada por TikTok Inc., ByteDance Ltd., ni OBS Studio / OBS Project.
          </p>
        </footer>
      </div>
    </div>
  );
}
