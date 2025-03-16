import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'utilities',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['typescript'],
      output: {
        globals: {
          typescript: 'typescript'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});