import React, { createContext, ReactNode, useContext, useState } from 'react';

interface DialogContextType {
  stack: ReactNode[];
  push: (dialog: ReactNode) => void;
  pop: () => void;
  replace: (dialog: ReactNode) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<ReactNode[]>([]);

  const push = (dialog: ReactNode) => {
    setStack((prevStack) => [...prevStack, dialog]);
  };

  const pop = () => {
    setStack((prevStack) => prevStack.slice(0, -1));
  };

  const replace = (dialog: ReactNode) => {
    setStack((prevStack) => {
      if (prevStack.length === 0) return [dialog]; // If stack is empty, push the new dialog
      return [...prevStack.slice(0, -1), dialog]; // Replace the last dialog
    });
  };

  return <DialogContext.Provider value={{ stack, push, pop, replace }}>{children}</DialogContext.Provider>;
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
  return <div className={'fixed z-40'}>{stack.length > 0 && stack[stack.length - 1]}</div>;
};
