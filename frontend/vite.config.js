import { defineConfig } from 'vite';
import vitePluginCspNonce from './vite-plugin-csp-nonce.js';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [vitePluginCspNonce()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        login: path.resolve(__dirname, 'login.html'),
        register: path.resolve(__dirname, 'register.html'),
        dashboard: path.resolve(__dirname, 'dashboard.html'),
      }
    }
  }
});
