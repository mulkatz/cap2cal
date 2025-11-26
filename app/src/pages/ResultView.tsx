import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { LoadingController } from '../components/features/dialogs/LoadingDialog.tsx';
import { SingleResultContent } from '../components/features/results/SingleResultContent.tsx';
import { MultiResultContent } from '../components/features/results/MultiResultContent.tsx';
import { ErrorResultContent } from '../components/features/results/ErrorResultContent.tsx';
import { CardController } from '../components/features/cards/CardController.tsx';

export const ResultView = ({ onClose }: { onClose: () => void }) => {
  const { appState, resultData } = useAppContext();

  return (
    <div className="pointer-events-auto absolute inset-0 z-50">
      {/* Magic pattern background */}
      <div className="absolute inset-0 bg-primary">
        <div className={'magicpattern absolute inset-0 flex'} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative h-full w-full">
        {appState === 'loading' && <LoadingController />}

        {appState === 'result' && resultData && (
          <>
            {resultData.type === 'single' && resultData.events && resultData.events.length > 0 && (
              <SingleResultContent onClose={onClose}>
                <CardController data={resultData.events[0]} />
              </SingleResultContent>
            )}

            {resultData.type === 'multi' && resultData.events && resultData.events.length > 0 && (
              <MultiResultContent onClose={onClose}>
                {resultData.events.map((event) => (
                  <CardController key={event.id} data={event} />
                ))}
              </MultiResultContent>
            )}

            {resultData.type === 'error' && resultData.errorReason && (
              <ErrorResultContent reason={resultData.errorReason} onClose={onClose} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
