import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ top: 'env(safe-area-inset-top, 0px)' }}
      toastOptions={{
        duration: 2500,
        style: {
          background: '#1E2E3F',
          color: '#FDDCFF',
          border: '1px solid #415970',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: '#FFE566',
            secondary: '#1E2E3F',
          },
        },
        error: {
          iconTheme: {
            primary: '#FF6B6B',
            secondary: '#1E2E3F',
          },
        },
      }}
    />
  );
};
