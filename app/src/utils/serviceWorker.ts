import toast from 'react-hot-toast';

export const initServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      toast('A new version of the app is available - refresh', {
        icon: '🤖',
        style: {
          borderRadius: '6px',
          background: '#1E2938',
          color: '#fff',
        },
      });
      setTimeout(() => {
        window.location.reload(); // Force reload when a new service worker is activated
      }, 300);
    });
  }
};
