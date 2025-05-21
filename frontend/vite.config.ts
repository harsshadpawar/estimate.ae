import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'shared': path.resolve(__dirname, 'shared/src'),  // ✅ points to the nested "src"
      '@': path.resolve(__dirname, 'src') ,
      "features":path.resolve(__dirname, 'src/pages/features') ,         // optional alias for general "src"
      "common":path.resolve(__dirname, 'src/pages/common') ,         // optional alias for general "src"
    },
  },
})
