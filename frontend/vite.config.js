// Import required dependencies
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration
// https://vitejs.dev/config/
export default defineConfig({
  // Enable React plugin
  plugins: [react()],

  // Server configuration
  server: {
    port: 5173,
    open: true, // Automatically open browser
    proxy: {
      // Proxy API requests to backend server
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
