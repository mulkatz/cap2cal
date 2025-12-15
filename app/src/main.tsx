import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate, Route, Routes } from 'react-router-dom';

import './index.css';
import './all.css';

import { App } from './pages/App';
import { AppProviders } from './contexts/AppProviders.tsx';
import { initI18n } from './utils/i18n';

// Initialize i18n and wait for translations to load before rendering
// This prevents flash of untranslated content (FOUC)
initI18n().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProviders>
    </StrictMode>
  );
});
