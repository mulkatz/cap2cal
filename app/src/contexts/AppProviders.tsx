import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import { DialogProvider } from './DialogContext.tsx';
import { FirebaseProvider } from './FirebaseContext.tsx';
import { AppProvider } from './AppContext.tsx';
import { EffectProvider } from './EffectsContext.tsx';
import { ErrorBoundary } from '../components/ui/ErrorBoundary.tsx';
import { i18next } from '../utils/i18n';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18next}>
        <AppProvider>
          <EffectProvider>
            <FirebaseProvider>
              <DialogProvider>
                <BrowserRouter>{children}</BrowserRouter>
              </DialogProvider>
            </FirebaseProvider>
          </EffectProvider>
        </AppProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
