import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    globals: false,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.config.*',
        '**/*.d.ts',
        '**/__tests__/**',
        'src/**/ports/**',
        'src/main.ts',
        'src/apps/web/main.ts',
        'src/sw.ts',
        'src/**/index.ts',
        // Trivial passthrough use cases (service is what carries the logic and is tested)
        'src/contexts/history/application/AddToHistoryUseCase.ts',
        'src/contexts/history/application/GetHistoryUseCase.ts',
        'src/contexts/history/application/ClearHistoryUseCase.ts',
        'src/contexts/favorites/application/AddFavoriteUseCase.ts',
        'src/contexts/favorites/application/RemoveFavoriteUseCase.ts',
        'src/contexts/favorites/application/GetFavoritesUseCase.ts',
        'src/contexts/notes/application/AddNoteUseCase.ts',
        'src/contexts/notes/application/UpdateNoteUseCase.ts',
        'src/contexts/notes/application/DeleteNoteUseCase.ts',
        'src/contexts/notes/application/GetNotesUseCase.ts',
        'src/contexts/pinned-currencies/application/PinCurrencyUseCase.ts',
        'src/contexts/pinned-currencies/application/UnpinCurrencyUseCase.ts',
        'src/contexts/pinned-currencies/application/GetPinnedCurrenciesUseCase.ts',
        'src/contexts/exchange-rate/application/GetExchangeRateUseCase.ts',
        // Logger: pure I/O wrapper over console
        'src/shared-infrastructure/logging/ConsoleLogger.ts',
        // Trivial delegate over navigator.language (covered indirectly by DetectBrowserLanguageUseCase)
        'src/contexts/language/infrastructure/out/BrowserLanguageProvider.ts',
      ],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
      },
    },
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
});
