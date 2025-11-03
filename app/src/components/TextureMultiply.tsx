import pattern5 from '../assets/images/pattern5.jpg';
import React from 'react';

export const TextureMultiply = ({ opacity }: { opacity: number }) => {
  return (
    <div
      className={'pointer-events-none absolute inset-0'}
      style={{
        backgroundImage: `url(${pattern5})`,
        backgroundSize: 'cover', // Or 'contain', 'auto', etc.
        backgroundRepeat: 'repeat', // Set to 'no-repeat' if you only want it once
        backgroundPosition: 'center', // Adjust based on your design needs
        backgroundBlendMode: 'multiply',
        opacity: opacity,
      }}
    />
  );
};
