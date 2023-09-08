import { defineConfig } from 'vite';
import { resolve } from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        session: resolve(__dirname, 'src/session.html'),
        nextten: resolve(__dirname, 'src/nextten.html'),
        monthly: resolve(__dirname, 'src/monthly.html'),
        yearly: resolve(__dirname, 'src/yearly.html'),
      }
    },
    outDir: resolve(__dirname, 'dist')
  },
  root: 'src',
});