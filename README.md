# ConvertHub

Offline-first PWA to convert currencies, units and clothing/shoe sizes. Multi-language (EN / ES / EU), no ads, no tracking.

Built with TypeScript (strict), Vite, Vitest and Playwright. Architecture: Hexagonal (Ports & Adapters) + tactical DDD + SOLID.

## Stack

- TypeScript 5 (strict)
- Vite 8 + vanilla DOM
- Vitest 3 + happy-dom
- Playwright (E2E)
- ESLint 9 + Prettier 3

## Scripts

```bash
npm run dev            # dev server
npm run build          # type-check + production build
npm run preview        # serve dist/
npm run type-check     # tsc --noEmit
npm run lint           # eslint .
npm run format         # prettier --write
npm test               # vitest run
npm run test:coverage  # vitest with coverage
npm run e2e            # playwright tests
```

## Requirements

- Node ≥ 20
- npm ≥ 9

## License

MIT
