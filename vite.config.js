import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Asegura compatibilidad con GitHub Pages y rutas relativas
  server: {
    port: 3000,
    open: true
  }
});
