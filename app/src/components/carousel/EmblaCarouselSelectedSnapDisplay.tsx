import React, { useCallback, useEffect, useState } from 'react';

export const useSelectedSnapDisplay = (emblaApi: any) => {
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const updateScrollSnapState = useCallback((emblaApi: any) => {
    setSnapCount(emblaApi.scrollSnapList().length);
    setSelectedSnap(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    updateScrollSnapState(emblaApi);
    emblaApi.on('select', updateScrollSnapState);
    emblaApi.on('reInit', updateScrollSnapState);
  }, [emblaApi, updateScrollSnapState]);

  return {
    selectedSnap,
    snapCount,
  };
};

export const SelectedSnapDisplay = (props: any) => {
  const { selectedSnap, snapCount } = props;

  return (
    <div className="flex items-center justify-center rounded-full bg-white/10 px-5 py-2 backdrop-blur-md">
      <span className="font-mono font-medium text-white">
        {selectedSnap + 1} / {snapCount}
      </span>
    </div>
  );
};
