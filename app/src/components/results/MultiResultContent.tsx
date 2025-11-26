import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { IconCheck } from '../../assets/icons';
import { cn } from '../../utils.ts';

const PrevButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <button
    className={cn(
      'ml-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10',
      disabled && 'pointer-events-none opacity-0'
    )}
    type="button"
    onClick={onClick}
    disabled={disabled}>
    <svg className="h-[35%] w-[35%] text-white" viewBox="0 0 532 532">
      <path
        fill="currentColor"
        d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
      />
    </svg>
  </button>
);

const NextButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <button
    className={cn(
      'mr-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10',
      disabled && 'pointer-events-none opacity-0'
    )}
    type="button"
    onClick={onClick}
    disabled={disabled}>
    <svg className="h-[35%] w-[35%] text-white" viewBox="0 0 532 532">
      <path
        fill="currentColor"
        d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
      />
    </svg>
  </button>
);

const SelectedSnapDisplay = ({ selectedSnap, snapCount }: { selectedSnap: number; snapCount: number }) => (
  <div className="flex items-center justify-center rounded-full bg-white/10 px-5 py-2 backdrop-blur-md">
    <span className="font-mono font-medium text-white">
      {selectedSnap + 1} / {snapCount}
    </span>
  </div>
);

export const MultiResultContent = ({ children, onClose }: { children: ReactNode[]; onClose?: () => void }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = children.length;

  // Track scroll position to update current index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.clientWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setCurrentIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const slideWidth = container.clientWidth;
    container.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth',
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToSlide(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < slideCount - 1) {
      scrollToSlide(currentIndex + 1);
    }
  };

  return (
    <div className={'absolute inset-0 flex h-full flex-col'}>
      {/* Scroll container */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-scroll overflow-y-hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
          {children.map((child, index) => (
            <div
              key={index}
              className="flex min-w-full snap-start items-center justify-center px-4"
              style={{ scrollSnapStop: 'always' }}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between px-2">
        <PrevButton onClick={handlePrev} disabled={currentIndex === 0} />
        <SelectedSnapDisplay selectedSnap={currentIndex} snapCount={slideCount} />
        <NextButton onClick={handleNext} disabled={currentIndex === slideCount - 1} />
      </div>

      {/* Done button */}
      <div className="mb-10 flex w-full items-center justify-center self-end px-4 pb-safe-offset-12">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full border-[4px] border-white/20 shadow-lg"
          onClick={onClose}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
            <IconCheck size={28} strokeWidth={3.5} className="text-white" />
          </div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .snap-x::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
