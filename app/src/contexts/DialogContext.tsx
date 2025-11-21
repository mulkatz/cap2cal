import React, { createContext, ReactNode, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

type BackHandler = () => boolean; // Returns true if handled

interface DialogContextType {
  stack: ReactNode[];
  push: (dialog: ReactNode) => void;
  pop: () => void;
  replace: (dialog: ReactNode) => void;
  registerBackHandler: (id: string, handler: BackHandler) => void;
  unregisterBackHandler: (id: string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<ReactNode[]>([]);
  const backHandlersRef = useRef<Map<string, BackHandler>>(new Map());

  const push = (dialog: ReactNode) => {
    setStack((prevStack) => [...prevStack, dialog]);
  };

  const pop = useCallback(() => {
    setStack((prevStack) => prevStack.slice(0, -1));
  }, []);

  const replace = (dialog: ReactNode) => {
    setStack((prevStack) => {
      if (prevStack.length === 0) return [dialog]; // If stack is empty, push the new dialog
      return [...prevStack.slice(0, -1), dialog]; // Replace the last dialog
    });
  };

  const registerBackHandler = useCallback((id: string, handler: BackHandler) => {
    backHandlersRef.current.set(id, handler);
  }, []);

  const unregisterBackHandler = useCallback((id: string) => {
    backHandlersRef.current.delete(id);
  }, []);

  const handleBack = useCallback(() => {
    // First, try dialog stack
    if (stack.length > 0) {
      pop();
      return;
    }

    // Then try registered handlers (in reverse order of registration)
    const handlers = Array.from(backHandlersRef.current.values()).reverse();
    for (const handler of handlers) {
      if (handler()) return; // Handler returned true, back was handled
    }
  }, [stack.length, pop]);

  // Handle native back button (Android)
  useEffect(() => {
    const listener = App.addListener('backButton', handleBack);

    return () => {
      listener.then((l) => l.remove());
    };
  }, [handleBack]);

  // Handle iOS edge swipe gesture
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'ios') return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);

      // Edge swipe: started from left edge (< 30px), swiped right > 80px, minimal vertical movement
      if (touchStartX < 30 && deltaX > 80 && deltaY < 100) {
        handleBack();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleBack]);

  return <DialogContext.Provider value={{ stack, push, pop, replace, registerBackHandler, unregisterBackHandler }}>{children}</DialogContext.Provider>;
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
};

export const DialogStack: React.FC = () => {
  const { stack } = useDialogContext();
  return <div className={`fixed inset-0 z-[70] ${stack.length === 0 ? 'pointer-events-none' : ''}`}>{stack.map((dialog, index) => <React.Fragment key={index}>{dialog}</React.Fragment>)}</div>;
};
