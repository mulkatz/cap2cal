import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { usePageTracking } from './hooks/usePageTracking';

// Eager load: Landing page (most common route)
import LandingPage from './LandingPage';

// Lazy load: Secondary pages (load on demand)
const Terms = lazy(() => import('./Terms'));
const Privacy = lazy(() => import('./Privacy'));
const DownloadPage = lazy(() => import('./pages/DownloadPage').then((module) => ({ default: module.DownloadPage })));

const Loader = () => (
  <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
    Loading...
  </div>
);

function AppContent() {
  usePageTracking();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/invite"
        element={
          <Suspense fallback={<Loader />}>
            <DownloadPage />
          </Suspense>
        }
      />
      <Route
        path="/terms"
        element={
          <Suspense fallback={<Loader />}>
            <Terms />
          </Suspense>
        }
      />
      <Route
        path="/privacy"
        element={
          <Suspense fallback={<Loader />}>
            <Privacy />
          </Suspense>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}

export default App;