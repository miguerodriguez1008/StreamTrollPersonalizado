import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';

const LandingPage = lazy(() => import('./LandingPage.jsx'));
const LegalPage = lazy(() => import('./LegalPage.jsx'));
const Dashboard = lazy(() => import('./Dashboard.jsx'));
const Overlay = lazy(() => import('./Overlay.jsx'));
const GiftSliderOverlay = lazy(() => import('./GiftSliderOverlay.jsx'));
const TimerOverlay = lazy(() => import('./TimerOverlay.jsx'));

function App() {
  // Check direct query parameter (?view=overlay) or pathname (/overlay)
  const isDirectOverlay = 
    typeof window !== 'undefined' && 
    (window.location.search.includes('view=overlay') || window.location.pathname.endsWith('/overlay'));

  if (isDirectOverlay) {
    return (
      <Suspense fallback={null}>
        <Overlay />
      </Suspense>
    );
  }

  // Check direct query parameter (?view=slider) or pathname (/slider)
  const isDirectSlider = 
    typeof window !== 'undefined' && 
    (window.location.search.includes('view=slider') || window.location.pathname.endsWith('/slider') || window.location.pathname.endsWith('/giftslider'));

  if (isDirectSlider) {
    return (
      <Suspense fallback={null}>
        <GiftSliderOverlay />
      </Suspense>
    );
  }

  // Check direct query parameter (?view=timer) or pathname (/timer)
  const isDirectTimer = 
    typeof window !== 'undefined' && 
    (window.location.search.includes('view=timer') || window.location.pathname.endsWith('/timer'));

  if (isDirectTimer) {
    return (
      <Suspense fallback={null}>
        <TimerOverlay />
      </Suspense>
    );
  }

  const isElectron = 
    typeof window !== 'undefined' && 
    (window.navigator?.userAgent?.toLowerCase()?.includes('electron') || Boolean(window.process?.versions?.electron));

  return (
    <HashRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={isElectron ? <Dashboard /> : <LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/overlay" element={<Overlay />} />
          <Route path="/slider" element={<GiftSliderOverlay />} />
          <Route path="/giftslider" element={<GiftSliderOverlay />} />
          <Route path="/timer" element={<TimerOverlay />} />
          <Route path="*" element={isElectron ? <Dashboard /> : <LandingPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
