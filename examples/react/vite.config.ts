import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@xyflow/react/electrical': path.resolve(__dirname, '../../packages/react/src/electrical-components/index.ts'),
      '@xyflow/react/dist': path.resolve(__dirname, '../../packages/react/dist'),
      '@xyflow/react': path.resolve(__dirname, '../../packages/react/src'),
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['../..'],
    },
  },
});
