# ConvertHub

[**Live demo →**](https://endika.github.io/converthub/)

Offline-first PWA to convert currencies, units and clothing/shoe sizes. Multi-language (EN / ES / EU), no ads, no tracking.

Built with TypeScript (strict), Vite, Vitest and Playwright. Architecture: **Hexagonal (Ports & Adapters) + tactical DDD + SOLID**.

## Stack

- TypeScript 6 (strict)
- Vite 8 + vanilla DOM (no framework)
- Vitest 4 + happy-dom (unit / integration)
- Playwright (E2E)
- ESLint 10 + Prettier 3
- vite-plugin-pwa (Workbox) — installable PWA, offline cache
- GitHub Actions CI/CD + GitHub Pages deploy

## Architecture

```
src/
├── contexts/                 # Bounded Contexts (DDD)
│   ├── conversion/           # Money, Distance, Weight, Volume, Temperature, Speed, Size
│   ├── exchange-rate/        # API client + cache + freshness
│   ├── language/             # i18n EN/ES/EU + Observer
│   ├── history/              # 20 last conversions (FIFO)
│   ├── favorites/            # 10 favorites max
│   ├── notes/                # 50 travel notes max
│   └── pinned-currencies/    # User-pinned currency codes, shown first
├── shared-kernel/            # ValueObject, Entity, AggregateRoot, Result, ports
├── shared-infrastructure/    # ConsoleLogger
├── apps/web/                 # Composition root (DI container) + UI components
└── main.ts                   # Entry point
```

Each Bounded Context is a mini-hexagon:

```
domain/             # Pure business logic, zero outbound deps
├── model/          # Entities + Value Objects
├── ports/in/       # Use case interfaces (driving)
├── ports/out/      # Repository / provider interfaces (driven)
├── services/       # Domain services
└── errors/

application/        # Use case implementations (implement ports/in)
infrastructure/
├── in/             # Driving adapters (UI → use cases)
└── out/            # Driven adapters (localStorage, HTTP)
```

The **dependency rule** is enforced by `no-restricted-imports` in ESLint: `domain/` cannot import from `application/` or `infrastructure/`; `application/` cannot import from `infrastructure/`.

## Scripts

```bash
npm run dev             # dev server
npm run build           # type-check + production build (+ Workbox SW)
npm run preview         # serve dist/
npm run type-check      # tsc --noEmit
npm run lint            # eslint .
npm run format          # prettier --write
npm run format:check    # prettier --check
npm test                # vitest run
npm run test:coverage   # vitest + coverage thresholds (80/75/80/80)
npm run e2e             # playwright tests
```

## Requirements

- Node ≥ 20
- npm ≥ 9

## License

MIT
