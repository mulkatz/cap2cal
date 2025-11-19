import { useState, useCallback } from 'react';

export interface Ripple {
  x: number;
  y: number;
  size: number;
  key: number;
}

export const useRipple = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    // Calculate click position relative to button
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate ripple size (diameter should cover the entire button)
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      key: Date.now(),
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prevRipples) => prevRipples.filter((r) => r.key !== newRipple.key));
    }, 600);
  }, []);

  return { ripples, addRipple };
};
