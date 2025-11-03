/**
 * DOM Utilities
 * Functions for DOM manipulation and styling
 */

import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(classes));
};

export const disableBounceOverscroll = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && (window as any).MSStream;
  if (isIOS) {
    document.documentElement.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
  }
};

export const getSafeAreaTopHeight = () => {
  const safeAreaElement = document.querySelector('.pt-safe');
  if (safeAreaElement) {
    const computedStyle = getComputedStyle(safeAreaElement);
    const paddingTopValue = computedStyle.paddingTop;
    return paddingTopValue;
  }
  return '0px';
};
