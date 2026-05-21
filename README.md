# ConvertHub

**The offline converter for travellers.** Pay the right tip, know what 5,000 yen actually costs you in euros, and figure out if you fit a size 8 in Italy — without burning your data roaming.

[**Try it now →**](https://endika.github.io/converthub/)

Install it on your phone or laptop and it just works on the plane, in the metro, anywhere. No account. No ads. No tracking.

## What it does

- **Currencies.** All 160+, with the last rates cached so you don't need signal at the restaurant.
- **Tip calculator.** Type the bill in the local currency, see tip and total in both that currency and yours. Defaults adjust per country — USA 18%, Japan 0%, Spain 10%, and so on. Split between any number of people, round up the total if you want.
- **Distance, weight, volume, temperature, speed.** The everyday conversions you actually need abroad.
- **Clothing & shoe sizes.** EU / US / UK for men, women and kids — the part of travel nobody tells you about until you're in the fitting room.
- **Travel notes.** Jot down "the café near Plaza Mayor" with a location attached.
- **Favorites & history.** Pin the conversions you do most often, replay the last 20.
- **Three languages.** English, Spanish, Basque.

## Why it might be your travel app

- **Offline by design.** Cached rates, full app shell. The currency tab is the only feature that benefits from internet — and even that runs on whatever rates you last loaded.
- **Installable.** Open it in your browser, then "Add to Home Screen" on mobile or "Install" on desktop. Behaves like a native app, takes about 100 KB.
- **No tracking, no ads, no account.** The source code is here, end to end.
- **Free and open source.** MIT licensed.

## Install on your device

1. Open [the live app](https://endika.github.io/converthub/) on your phone or computer.
2. Add it to your home screen, or install it as an app — your browser will offer the option from the address bar or the share menu.
3. Open it like any other app, online or offline.

---

## For developers

TypeScript (strict) + Vite + Vitest + Playwright. Vanilla DOM, no framework. Hexagonal (Ports & Adapters) layout with bounded contexts under `src/contexts/` and a thin DI container at `src/apps/web/di/`. The dependency rule (`domain ← application ← infrastructure`) is enforced via `no-restricted-imports`.

```bash
npm install
npm run dev             # dev server
npm test                # unit + integration (vitest)
npm run e2e             # end-to-end (playwright)
npm run build           # production build with service worker
```

Requires Node ≥ 20, npm ≥ 9.

## License

MIT.
