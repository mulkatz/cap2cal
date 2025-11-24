import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../models/db.ts';
import { IconChevronLeft } from '../assets/icons';
import { useTranslation } from 'react-i18next';

export const ImagePreview = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { t } = useTranslation();
  const img =
    useLiveQuery(async () => {
      return db.images.where('id').equals(id).first();
    }) || null;

  return (
    <div className="fixed inset-0 z-[60] flex h-screen w-full flex-col overflow-hidden bg-[#0B1219]">
      {/* Floating Header */}
      <header className="absolute left-0 right-0 top-0 z-10 flex h-16 items-center justify-between px-4 pb-8 pt-safe-offset-6">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-secondary transition-colors active:text-highlight"
          aria-label="Go back">
          <IconChevronLeft size={24} />
        </button>

        {/* Title with pill background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#0B1219] px-4 py-2 backdrop-blur-md">
          <h1 className="text-xs font-semibold text-white/70">
            {t('dialogs.imagePreview.title')}
          </h1>
        </div>

        {/* Empty spacer for layout balance */}
        <div className="w-8" />
      </header>

      {/* Main Image Container */}
      <main className="flex flex-1 items-center justify-center">
        <TransformWrapper initialScale={1} minScale={0.5} maxScale={4} centerOnInit={true}>
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
            }}
            contentStyle={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <img
              src={img?.dataUrl}
              alt="captured image"
              className="h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-xl object-contain shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]"
            />
          </TransformComponent>
        </TransformWrapper>
      </main>

      {/* Bottom Metadata Pill */}
      <div className="absolute bottom-safe-offset-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#1E2E3F] px-6 py-3">
        <span className="text-sm font-semibold text-white">{t('dialogs.imagePreview.originalCapture')}</span>
      </div>
    </div>
  );
};
