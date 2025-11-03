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
    <div className="flex items-center justify-center rounded-full border-[1px] border-accentElevated bg-primaryDark px-3 py-0.5">
      <span>
        {selectedSnap + 1} / {snapCount}
      </span>
    </div>
  );
};
