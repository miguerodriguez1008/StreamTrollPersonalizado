import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LandingPage.css';

export default function LegalPage() {
  const location = useLocation();
  const [activeDoc, setActiveDoc] = useState('terms');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const doc = params.get('doc');
    if (doc && ['terms', 'privacy', 'disclaimer', 'refunds', 'cookies'].includes(doc)) {
      setActiveDoc(doc);
    }
  }, [location]);

  return (
    <div className="landing-wrapper" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              StreamTroll
            </span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Centro Legal & Cumplimiento
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/landing" className="landing-btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}>
              ← Volver a la Landing
            </Link>
            <Link to="/dashboard" className="landing-btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}>
              🎮 Abrir App
            </Link>
          </div>
        </header>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) 1fr', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Navigation Sidebar */}
          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '16px', padding: '1.25rem', backdropFilter: 'blur(10px)', position: 'sticky', top: '2rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              Documentos Legales Obligatorios
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setActiveDoc('terms')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeDoc === 'terms' ? 700 : 500,
                  color: activeDoc === 'terms' ? '#fff' : '#cbd5e1',
                  background: activeDoc === 'terms' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.3))' : 'transparent',
                  borderLeft: activeDoc === 'terms' ? '3px solid #ec4899' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <span>📜</span>
                <span>Términos y Condiciones</span>
              </button>

              <button
                onClick={() => setActiveDoc('privacy')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeDoc === 'privacy' ? 700 : 500,
                  color: activeDoc === 'privacy' ? '#fff' : '#cbd5e1',
                  background: activeDoc === 'privacy' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.3))' : 'transparent',
                  borderLeft: activeDoc === 'privacy' ? '3px solid #ec4899' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <span>🔒</span>
                <span>Política de Privacidad</span>
              </button>

              <button
                onClick={() => setActiveDoc('disclaimer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeDoc === 'disclaimer' ? 700 : 500,
                  color: activeDoc === 'disclaimer' ? '#fff' : '#cbd5e1',
                  background: activeDoc === 'disclaimer' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.3))' : 'transparent',
                  borderLeft: activeDoc === 'disclaimer' ? '3px solid #ec4899' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <span>⚠️</span>
                <span>Aviso Legal & Deslinde</span>
              </button>

              <button
                onClick={() => setActiveDoc('refunds')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeDoc === 'refunds' ? 700 : 500,
                  color: activeDoc === 'refunds' ? '#fff' : '#cbd5e1',
                  background: activeDoc === 'refunds' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.3))' : 'transparent',
                  borderLeft: activeDoc === 'refunds' ? '3px solid #ec4899' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <span>💳</span>
                <span>Reembolsos y Pagos</span>
              </button>

              <button
                onClick={() => setActiveDoc('cookies')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeDoc === 'cookies' ? 700 : 500,
                  color: activeDoc === 'cookies' ? '#fff' : '#cbd5e1',
                  background: activeDoc === 'cookies' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.3))' : 'transparent',
                  borderLeft: activeDoc === 'cookies' ? '3px solid #ec4899' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <span>🍪</span>
                <span>Política de Cookies</span>
              </button>
            </nav>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
              Desarrollado y operado por <strong style={{ color: '#fbbf24' }}>ZENIC S.A.S</strong>. En cumplimiento de normativas de comercio electrónico, protección al consumidor y tratamiento de datos personales.
            </div>
          </div>

          {/* Main Legal Content */}
          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(12px)', color: '#cbd5e1', lineHeight: 1.7 }}>
            
            {/* 1. TÉRMINOS Y CONDICIONES */}
            {activeDoc === 'terms' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>📜</span>
                  <h1 style={{ color: '#fff', fontSize: '1.9rem', margin: 0, fontWeight: 800 }}>Términos y Condiciones de Uso</h1>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
                  Última actualización: Noviembre de 2026 | Operado por <strong>ZENIC S.A.S</strong>
                </div>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Aceptación de los Términos</h3>
                <p>
                  El acceso, descarga, instalación y uso de la aplicación de software <strong>StreamTroll</strong> (en adelante, la "Plataforma" o el "Software"), así como de su sitio web y servicios asociados, constituyen la aceptación plena y sin reservas de los presentes Términos y Condiciones por parte del usuario (en adelante, el "Usuario" o "Streamer"). Si no está de acuerdo con estos términos, absténgase de utilizar el Software.
                </p>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Objeto del Software y Licencia de Uso</h3>
                <p>
                  StreamTroll es una solución tecnológica diseñada para la interacción en transmisiones en vivo (streaming), permitiendo integrar efectos visuales (shaders), alertas sonoras, carruseles de regalos, temporizadores y animaciones gráficas en tiempo real en vinculación con plataformas como TikTok Live y software de transmisión como OBS Studio.
                </p>
                <p>
                  ZENIC S.A.S otorga al Usuario una licencia personal, revocable, no exclusiva, intransferible y limitada para instalar y ejecutar StreamTroll de conformidad con el plan contratado (Gratuito, Pro o Ultimate).
                </p>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Requisitos y Uso Permitido</h3>
                <ul>
                  <li>El Usuario declara ser mayor de edad legal o contar con el consentimiento expreso de sus padres o tutores legales para realizar transmisiones en vivo.</li>
                  <li>El Usuario se compromete a no utilizar el Software para fines ilícitos, engañosos, constitutivos de acoso, difamación, vulneración de derechos de autor o violación de las Normas de la Comunidad de TikTok ni de ninguna otra plataforma de difusión.</li>
                  <li>Queda estrictamente prohibida la ingeniería inversa, descompilación no autorizada, redistribución comercial no autorizada o explotación ilegítima del código fuente o marcas registradas de ZENIC S.A.S.</li>
                </ul>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Limitación de Responsabilidad</h3>
                <p>
                  ZENIC S.A.S no se hace responsable por:
                </p>
                <ul>
                  <li>Bloqueos, sanciones, advertencias (*strikes*) o suspensiones de cuentas de TikTok, Twitch, YouTube o cualquier red social que puedan sufrir los usuarios como consecuencia del contenido transmitido o del comportamiento durante sus directos.</li>
                  <li>Fallas en el servicio de Internet del usuario, caídas de la API de TikTok o incompatibilidades de hardware local.</li>
                  <li>El Software se suministra "tal cual" y "según disponibilidad", garantizando el soporte técnico conforme a los canales oficiales habilitados.</li>
                </ul>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>5. Modificaciones y Ley Aplicable</h3>
                <p>
                  ZENIC S.A.S se reserva el derecho de modificar o actualizar estos términos en cualquier momento. El uso continuado del Software tras la publicación de cambios implicará su aceptación. Los presentes términos se rigen e interpretan con base en las leyes de la República de Colombia y los estándares internacionales de comercio electrónico.
                </p>
              </div>
            )}

            {/* 2. POLÍTICA DE PRIVACIDAD */}
            {activeDoc === 'privacy' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>🔒</span>
                  <h1 style={{ color: '#fff', fontSize: '1.9rem', margin: 0, fontWeight: 800 }}>Política de Privacidad y Tratamiento de Datos</h1>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
                  Cumplimiento Ley 1581 de 2012 (Habeas Data) y RGPD / GDPR | Responsable: <strong>ZENIC S.A.S</strong>
                </div>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Identificación del Responsable del Tratamiento</h3>
                <p>
                  <strong>ZENIC S.A.S</strong>, con domicilio legal en Colombia, es la entidad responsable del tratamiento de los datos personales suministrados voluntariamente por los usuarios de StreamTroll. Correo de contacto y atención de derechos: <code style={{ color: '#38bdf8' }}>soporte@zenic.com.co</code>.
                </p>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Información que Recolectamos</h3>
                <p>
                  StreamTroll minimiza al máximo la recolección de datos, rigiéndose por el principio de necesidad:
                </p>
                <ul>
                  <li><strong>Datos de Identificación y Acceso:</strong> Correo electrónico y credenciales de autenticación suministradas al iniciar sesión o registrarse.</li>
                  <li><strong>Nombre de Usuario de TikTok:</strong> Únicamente el identificador público (ejemplo: <code>@usuario</code>) necesario para establecer la conexión WebSocket pública con la sala de transmisión en vivo. Nunca solicitamos ni almacenamos la contraseña de tu cuenta de TikTok.</li>
                  <li><strong>Configuración Local y Preferencias:</strong> Mapeo de regalos, duraciones, sonidos y ajustes visuales, almacenados directamente en el almacenamiento local de tu equipo (Local Storage / AppData).</li>
                </ul>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Finalidad del Tratamiento</h3>
                <p>
                  Los datos personales recabados tienen como único propósito:
                </p>
                <ul>
                  <li>Habilitar la ejecución técnica de las funciones del Software en tu equipo.</li>
                  <li>Gestionar la suscripción, facturación y niveles de acceso (Planes Gratuito, Pro o Ultimate).</li>
                  <li>Proveer soporte técnico, actualizaciones críticas de seguridad y notificaciones operativas.</li>
                </ul>
                <p style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 16px', borderRadius: '10px', color: '#34d399', fontWeight: 600 }}>
                  🛡️ Compromiso Cero Venta de Datos: ZENIC S.A.S NO vende, alquila, comercializa ni transfiere tus datos personales a terceros con fines publicitarios.
                </p>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Derechos del Titular (Habeas Data & GDPR)</h3>
                <p>
                  Como titular de tus datos personales, tienes derecho a:
                </p>
                <ul>
                  <li><strong>Conocer, actualizar y rectificar</strong> tus datos personales frente a ZENIC S.A.S.</li>
                  <li><strong>Revocar la autorización</strong> o solicitar la supresión definitiva de tu cuenta y datos asociados en cualquier momento enviando una solicitud a nuestro correo de soporte.</li>
                </ul>
              </div>
            )}

            {/* 3. AVISO LEGAL Y DESLINDE */}
            {activeDoc === 'disclaimer' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>⚠️</span>
                  <h1 style={{ color: '#fff', fontSize: '1.9rem', margin: 0, fontWeight: 800 }}>Aviso Legal y Deslinde de Responsabilidad</h1>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
                  Aviso de Interoperabilidad Tecnológica y Marcas de Terceros
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px 20px', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#f87171', margin: '0 0 6px 0', fontSize: '1.1rem' }}>Deslinde Expreso de Afiliación con TikTok y ByteDance Ltd.</h4>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#fca5a5' }}>
                    <strong>StreamTroll</strong> y <strong>ZENIC S.A.S</strong> son entidades y desarrollos completamente independientes. StreamTroll <strong>NO</strong> está patrocinado, avalado, respaldado, certificado, afiliado ni administrado de ninguna manera por <strong>TikTok Inc.</strong>, <strong>ByteDance Ltd.</strong>, <strong>OBS Studio / OBS Project</strong>, ni por ninguna de sus empresas subsidiarias o filiales.
                  </p>
                </div>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Uso Informativo y de Interoperabilidad de Marcas</h3>
                <p>
                  Los términos "TikTok", "TikTok Live", los nombres oficiales de los regalos virtuales (ej: Rosa, Donas, León, Galaxia) y el nombre "OBS Studio" son marcas comerciales o registradas propiedad exclusiva de sus respectivos titulares.
                </p>
                <p>
                  Su referencia en este sitio web y en el Software se realiza única y exclusivamente bajo la figura de **uso nominativo y legítimo**, con el fin meramente descriptivo de indicar la compatibilidad e interoperabilidad tecnológica de la herramienta con dichas plataformas públicas.
                </p>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Cumplimiento de Pautas de Streaming</h3>
                <p>
                  Es responsabilidad exclusiva e indelegable de cada creador de contenido y streamer asegurarse de que el uso de los efectos gráficos, sonidos y retos realizados durante sus transmisiones cumpla cabalmente con las Normas de la Comunidad y Políticas de Monetización de las plataformas donde transmite.
                </p>
              </div>
            )}

            {/* 4. REEMBOLSOS Y PAGOS */}
            {activeDoc === 'refunds' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>💳</span>
                  <h1 style={{ color: '#fff', fontSize: '1.9rem', margin: 0, fontWeight: 800 }}>Política de Suscripciones, Pagos y Reembolsos</h1>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
                  Condiciones Comerciales y de Facturación | ZENIC S.A.S
                </div>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Modelos de Suscripción (Free, Pro y Ultimate)</h3>
                <p>
                  StreamTroll ofrece un nivel de acceso Gratuito con capacidades funcionales esenciales, así como suscripciones de pago (Planes Pro y Ultimate) que desbloquean efectos avanzados sin restricciones, sonidos simultáneos y soporte prioritario.
                </p>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Ciclos de Facturación y Cancelación</h3>
                <p>
                  Las suscripciones se renuevan periódicamente según el ciclo seleccionado (mensual o anual). El usuario puede cancelar su suscripción en cualquier momento desde su panel de control o contactando al equipo de soporte. La cancelación detendrá la renovación automática al término del periodo facturado vigente.
                </p>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Derecho de Retracto y Política de Reembolso</h3>
                <p>
                  Conforme a la legislación de protección al consumidor y comercio electrónico, los usuarios que adquieran una suscripción digital tienen derecho a solicitar el reembolso total dentro de los primeros <strong>14 días calendario</strong> siguientes a su compra inicial, siempre que se presente una falla técnica imputable a la plataforma que el equipo de soporte técnico de ZENIC S.A.S no haya podido subsanar.
                </p>
                <p>
                  Para tramitar una solicitud de reembolso, dirija un correo a <code style={{ color: '#38bdf8' }}>soporte@zenic.com.co</code> indicando el correo de registro y el comprobante de transacción.
                </p>
              </div>
            )}

            {/* 5. POLÍTICA DE COOKIES */}
            {activeDoc === 'cookies' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>🍪</span>
                  <h1 style={{ color: '#fff', fontSize: '1.9rem', margin: 0, fontWeight: 800 }}>Política de Cookies y Almacenamiento Local</h1>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
                  Uso de Tecnologías de Almacenamiento Técnico
                </div>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. ¿Qué Tecnologías Utilizamos?</h3>
                <p>
                  StreamTroll y su portal web utilizan tecnologías de almacenamiento como <strong>Cookies técnicas</strong> y <strong>Local Storage</strong> de HTML5. Estas tecnologías son estrictamente necesarias para el funcionamiento correcto de la aplicación.
                </p>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Tipos de Almacenamiento Empleados</h3>
                <ul>
                  <li><strong>Sesión y Autenticación:</strong> Permiten recordar tu estado de inicio de sesión de forma segura sin pedir credenciales en cada recarga.</li>
                  <li><strong>Preferencias del Streamer:</strong> Guardan de manera instantánea tus colores, shaders activos, carrusel de regalos y lista de animaciones creadas.</li>
                  <li><strong>Caché Local de Rendimiento:</strong> Guardan los recursos gráficos para que OBS Studio no consuma ancho de banda ni provoque caídas de FPS.</li>
                </ul>

                <h3 style={{ color: '#ec4899', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Control y Eliminación</h3>
                <p>
                  El usuario puede en cualquier momento borrar la memoria caché o almacenamiento local desde la configuración de su navegador o a través de la opción "Cerrar Sesión / Restablecer Configuración" dentro del menú de la aplicación.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
          &copy; 2026 StreamTroll. Desarrollado y operado por <strong style={{ color: '#fbbf24' }}>ZENIC S.A.S</strong>. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}

