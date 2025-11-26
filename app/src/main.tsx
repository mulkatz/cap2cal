import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import './index.css';
import './all.css';

import { App } from './layers/App';
import { DialogProvider } from './contexts/DialogContext.tsx';
import { FirebaseProvider } from './contexts/FirebaseContext.tsx';
import { AppProvider } from './contexts/AppContext.tsx';
import { EffectProvider } from './contexts/EffectsContext.tsx';
import { PrivacyPage } from './components/PrivacyPage.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { i18next, initI18n } from './helper/i18nHelper';

// Initialize i18n before rendering
initI18n();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nextProvider i18n={i18next}>
        <AppProvider>
          <EffectProvider>
            <FirebaseProvider>
              <DialogProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/privacy-policy" element={<PrivacyPage />} />
                    {/*<Route path="/imprint" element={<ImprintPage />} />*/}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </DialogProvider>
            </FirebaseProvider>
          </EffectProvider>
        </AppProvider>
      </I18nextProvider>
    </ErrorBoundary>
  </StrictMode>
);
