import {
  URL,
  fileURLToPath,
} from 'url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'shared',
        replacement: fileURLToPath(new URL('../shared/src', import.meta.url)),
      },
      {
        find: 'common',
        replacement: fileURLToPath(new URL('./src/common', import.meta.url)),
      },
      {
        find: 'features',
        replacement: fileURLToPath(new URL('./src/features', import.meta.url)),
      },
      {
        find: 'widgets',
        replacement: fileURLToPath(new URL('./src/widgets', import.meta.url)),
      },
      {
        find: 'pages',
        replacement: fileURLToPath(new URL('./src/pages', import.meta.url)),
      },
      {
        find: 'assets',
        replacement: fileURLToPath(new URL('../assets', import.meta.url)),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
