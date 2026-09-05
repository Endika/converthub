# ConvertHub

> The offline converter for travellers.

**[Try it now →](https://endika.github.io/converthub/)**

[![Latest release](https://img.shields.io/github/v/release/Endika/converthub?style=flat-square&color=0066FF&label=release)](https://github.com/Endika/converthub/releases/latest)
[![CI](https://img.shields.io/github/actions/workflow/status/Endika/converthub/ci.yml?style=flat-square&label=ci&branch=main)](https://github.com/Endika/converthub/actions/workflows/ci.yml)
[![Last commit](https://img.shields.io/github/last-commit/Endika/converthub?style=flat-square)](https://github.com/Endika/converthub/commits/main)
[![Conventional Commits](https://img.shields.io/badge/conventional_commits-1.0.0-FE5196?style=flat-square)](https://www.conventionalcommits.org)
[![License: MIT](https://img.shields.io/github/license/Endika/converthub?style=flat-square&color=10B981)](./LICENSE)

ConvertHub is the travel companion that pays the right tip, tells you what 5,000 yen actually costs you in euros, and figures out whether you fit a size 8 in Italy — without burning your data roaming. Install it on your phone or laptop and it just works on the plane, in the metro, anywhere. No account. No ads. No tracking.

## What you can do

- **Currencies.** All 160+, with the last rates cached so you don't need signal at the restaurant.
- **Tip calculator.** Type the bill in the local currency, see tip and total in both currencies. Defaults adjust per country — USA 18%, Japan 0%, Spain 10%. Split between any number of people, round up the total if you want.
- **Distance, weight, volume, temperature, speed.** The everyday conversions you actually need abroad.
- **Clothing & shoe sizes.** EU / US / UK for men, women and kids — the part of travel nobody tells you about until you're in the fitting room.
- **Travel notes.** Jot down "the café near Plaza Mayor" with a location attached.
- **Favorites & history.** Pin the conversions you do most often, replay the last 20.
- **Three languages.** English, Spanish, Basque.

## How to start

1. Open the [live demo](https://endika.github.io/converthub/) on your phone or computer.
2. Install it (see below) so it works offline next time.
3. Convert. The currency tab benefits from internet for fresh rates; every other tab runs offline.

## Install on your device

Open the demo in Chrome, Edge or Safari and use **"Add to Home Screen"** (mobile) or **"Install"** (desktop). Behaves like a native app, takes about 100 KB, and works offline by design.

## Privacy

There is no ConvertHub server. Your favorites, history and notes live in your own browser. The only network traffic is fetching currency rates — and even that uses whatever rates you last loaded if you're offline. No account, no ads, no tracking, ever.

---

## For developers

Open-source, MIT licensed. PRs welcome.

**Stack** — TypeScript (strict), vanilla DOM with no framework runtime, Vite, Vitest, Playwright, ESLint + Prettier, release-please for automatic versioning from Conventional Commits.

**Architecture** — Hexagonal (Ports & Adapters) with bounded contexts under `src/contexts/` and a thin DI container at `src/apps/web/di/`. The dependency rule (`domain ← application ← infrastructure`) is enforced via `no-restricted-imports`.

**Local dev**

```bash
npm install
npm run dev             # dev server
npm run test:run        # unit + integration (vitest)
npm run e2e             # end-to-end (playwright)
npm run build           # production build with service worker
```

Requires Node ≥ 20, npm ≥ 9. CI runs lint, typecheck, tests and the production build on every PR.
