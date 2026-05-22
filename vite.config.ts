import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  root: './',
  base: process.env['VITE_BASE_PATH'] ?? '/converthub/',
  publicDir: 'public',

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'ConvertHub',
        short_name: 'ConvertHub',
        description:
          'Offline-first PWA to convert currencies, units and sizes.',
        theme_color: '#6366f1',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
        categories: ['productivity', 'travel', 'utilities'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.host === 'api.exchangerate-api.com',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'exchange-rate-api',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.host === 'api.frankfurter.app',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'frankfurter-api',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

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
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
