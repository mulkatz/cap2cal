import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    chunkSizeWarningLimit: 1600,
    // Enable advanced minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true, // Safari 10+ compatibility
      },
    },
    // Generate hidden source maps for crash reporting (not shipped to users)
    sourcemap: 'hidden',
  },
  server: {
    port: 9000,
  },
});
