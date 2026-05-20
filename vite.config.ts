import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: './',
  base: '/',
  publicDir: 'public',

  server: {
    port: 5173,
    strictPort: false,
    open: false,
    cors: true,
  },

  preview: {
    port: 4173,
    strictPort: false,
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true },
    },
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
  },

  resolve: {
    alias: {
      '@contexts': resolve(__dirname, './src/contexts'),
      '@shared-kernel': resolve(__dirname, './src/shared-kernel'),
      '@shared-infrastructure': resolve(
        __dirname,
        './src/shared-infrastructure',
      ),
      '@apps': resolve(__dirname, './src/apps'),
    },
  },

  define: {
    __VERSION__: JSON.stringify('1.0.0'),
  },
});
