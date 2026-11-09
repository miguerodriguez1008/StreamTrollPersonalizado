import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import LegalPage from './LegalPage.jsx';
import Dashboard from './Dashboard.jsx';
import Overlay from './Overlay.jsx';
import GiftSliderOverlay from './GiftSliderOverlay.jsx';
import TimerOverlay from './TimerOverlay.jsx';
import './index.css';

function App() {
  // Check direct query parameter (?view=overlay) or pathname (/overlay)
  const isDirectOverlay = 
    typeof window !== 'undefined' && 
    (window.location.search.includes('view=overlay') || window.location.pathname.endsWith('/overlay'));

  if (isDirectOverlay) {
    return <Overlay />;
  }

  // Check direct query parameter (?view=slider) or pathname (/slider)
  const isDirectSlider = 
    typeof window !== 'undefined' && 
    (window.location.search.includes('view=slider') || window.location.pathname.endsWith('/slider') || window.location.pathname.endsWith('/giftslider'));

  if (isDirectSlider) {
    return <GiftSliderOverlay />;
  }

  // Check direct query parameter (?view=timer) or pathname (/timer)
  const isDirectTimer = 
    typeof window !== 'undefined' && 
    (window.location.search.includes('view=timer') || window.location.pathname.endsWith('/timer'));

  if (isDirectTimer) {
    return <TimerOverlay />;
  }

  const isElectron = 
    typeof window !== 'undefined' && 
    (window.navigator?.userAgent?.toLowerCase()?.includes('electron') || Boolean(window.process?.versions?.electron));

  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
