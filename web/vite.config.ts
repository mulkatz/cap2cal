import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    chunkSizeWarningLimit: 500, // Reduced to catch large chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-i18n': [
            'i18next',
            'react-i18next',
            'i18next-browser-languagedetector',
            'i18next-http-backend',
          ],
          'vendor-firebase': ['firebase/app'],
          'vendor-helmet': ['react-helmet-async'],
          // PostHog will be in its own chunk automatically due to lazy loading
        },
      },
    },
    // Enable advanced minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true, // Safari 10+ compatibility
      },
    },
    // Generate source maps for debugging (optional, removes in production)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
  },
  server: {
    port: 9000,
  },
});
