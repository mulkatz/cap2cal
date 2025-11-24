import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../models/db.ts';
import { IconChevronLeft } from '../assets/icons';
import { useTranslation } from 'react-i18next';

export const ImagePreview = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { t, i18n } = useTranslation();
  const img =
    useLiveQuery(async () => {
      return db.images.where('id').equals(id).first();
    }) || null;

  const formatCaptureDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const locale = i18n.language === 'de-DE' ? 'de-DE' : 'en-GB';

    // Format: "Nov 27" or "27. Nov"
    const dateStr = date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });

    // Format: "20:00"
    const timeStr = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });

    // "Scanned on Nov 27 • 20:00" or "Gescannt am 27. Nov • 20:00"
    const prefix = locale === 'de-DE' ? 'Gescannt am' : 'Scanned on';
    return `${prefix} ${dateStr} • ${timeStr}`;
  };

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

        {/* Navigation Title */}
        <h1 className="text-lg font-semibold tracking-tight text-white">{t('dialogs.imagePreview.title')}</h1>

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
              className="h-auto max-h-[76vh] w-auto max-w-[90vw] rounded-xl object-contain shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]"
            />
          </TransformComponent>
        </TransformWrapper>
      </main>

      {/* Bottom Metadata Badge - only show if timestamp exists */}
      {img?.capturedAt && (
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md bottom-safe-offset-3">
          <span className="text-xs font-medium text-white/90">{formatCaptureDate(img.capturedAt)}</span>
        </div>
      )}
    </div>
  );
};
