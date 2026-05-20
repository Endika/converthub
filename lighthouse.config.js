// lighthouse.config.js

/**
 * Lighthouse CI Configuration
 *
 * Define performance budgets and thresholds for:
 * - Performance (>90)
 * - Accessibility (>90)
 * - Best Practices (>90)
 * - SEO (>90)
 * - PWA (>90)
 *
 * Runs automatically in GitHub Actions
 */

module.exports = {
  ci: {
    // Collections - múltiples runs
    collect: {
      // URL to audit
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/?tab=currencies',
        'http://localhost:3000/?lang=es',
      ],
      // Number of runs
      numberOfRuns: 3,
      // Chrome flags
      chromePath: null,
      // Static directory
      staticDistDir: './dist',
      // Upload results
      upload: {
        targetURL: 'https://converthub.io',
        serverBaseUrl: 'https://converthub.io/lhci',
      },
    },

    // Upload - dónde guardar resultados
    upload: {
      target: 'temporary-public-storage',
    },

    // Assert - umbrales mínimos
    assert: {
      // Presets: lighthouse:recommended, lighthouse:all
      preset: 'lighthouse:recommended',
      // Assertions personalizadas
      assertions: {
        // Performance
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // <2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],

        // Performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }], // <1.8s
        'speed-index': ['error', { maxNumericValue: 3387 }], // <3.4s
        interactive: ['error', { maxNumericValue: 3800 }], // <3.8s
        'total-blocking-time': ['error', { maxNumericValue: 200 }],

        // Accessibility
        'aria-allowed-attr': ['error'],
        'aria-required-attr': ['error'],
        'color-contrast': ['error'],
        'image-alt': ['error'],

        // Best Practices
        'uses-http2': ['error'],
        'uses-passive-event-listeners': ['error'],
        'valid-source-maps': ['error'],

        // SEO
        'document-title': ['error'],
        'meta-description': ['error'],
        viewport: ['error'],

        // Bundle size
        'resource-summary': [
          'error',
          {
            resourceType: 'script',
            budget: 1024, // 1MB
          },
        ],
      },
    },

    // Server - para local testing
    server: {
      port: 8080,
    },
  },
};
