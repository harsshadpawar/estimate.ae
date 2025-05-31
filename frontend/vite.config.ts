import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),compression(),visualizer()],
  resolve: {
    alias: {
      'shared': path.resolve(__dirname, 'src/shared/src'),  
      '@': path.resolve(__dirname, 'src'),
      "features": path.resolve(__dirname, 'src/pages/features'),         
      "common": path.resolve(__dirname, 'src/pages/common'),        
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    hmr: {
      overlay: true
    }
  },
})
