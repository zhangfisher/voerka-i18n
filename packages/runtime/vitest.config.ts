import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true, 
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});