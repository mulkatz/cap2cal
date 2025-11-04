import { createContext, ReactNode, useContext, useState } from 'react';

interface ResultContextType {
  content: ReactNode | null;
  show: (content: ReactNode) => void;
  hide: () => void;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode | null>(null);

  const show = (newContent: ReactNode) => {
    setContent(newContent);
  };

  const hide = () => {
    setContent(null);
  };

  return (
    <ResultContext.Provider value={{ content, show, hide }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResultContext = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error('useResultContext must be used within a ResultProvider');
  }
  return context;
};
