import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../models/db.ts';
import { IconChevronLeft } from '../assets/icons';

export const ImagePreview = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const img =
    useLiveQuery(async () => {
      return db.images.where('id').equals(id).first();
    }) || null;

  return (
    <div className="fixed inset-0 z-[60] h-screen w-full flex flex-col relative overflow-hidden bg-[#0B1219] inset-safe">
      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-6">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-[#1E2E3F] border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
          aria-label="Go back">
          <IconChevronLeft size={20} />
        </button>

        {/* Title */}
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white/70 uppercase tracking-[0.2em]">
          Source Scan
        </h1>

        {/* Empty spacer for layout balance */}
        <div className="w-[48px]" />
      </header>

      {/* Main Image Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <TransformWrapper>
          <TransformComponent>
            <img
              src={img?.dataUrl}
              alt="captured image"
              className="object-contain w-auto h-auto max-h-[80vh] rounded-xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]"
            />
          </TransformComponent>
        </TransformWrapper>
      </main>

      {/* Bottom Metadata Pill */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#1E2E3F] border border-white/10 px-6 py-3 rounded-full">
        <span className="text-white font-semibold text-sm">Original Capture</span>
      </div>
    </div>
  );
};
