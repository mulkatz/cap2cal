import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';
import './embla.css';

import './all.css';

import { App } from './layers/App';
import { DialogProvider } from './contexts/DialogContext.tsx';
import { FirebaseProvider } from './contexts/FirebaseContext.tsx';
import { AppProvider } from './contexts/AppContext.tsx';
import { EffectProvider } from './contexts/EffectsContext.tsx';
import { ResultProvider } from './contexts/ResultContext.tsx';
import { Playground } from './components/Playground.tsx';
import { PrivacyPage } from './components/PrivacyPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <EffectProvider>
        <FirebaseProvider>
          <ResultProvider>
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
          </ResultProvider>
        </FirebaseProvider>
      </EffectProvider>
    </AppProvider>
  </StrictMode>
);
