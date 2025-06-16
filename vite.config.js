// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/MathArt/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true, // needed for dev only
  }
});
