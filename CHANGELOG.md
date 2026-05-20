# Changelog

## [1.1.0](https://github.com/Endika/converthub/compare/v1.0.0...v1.1.0) (2026-05-20)


### Features

* **conversion:** 7 categories with value objects, services and use cases ([9099d5f](https://github.com/Endika/converthub/commit/9099d5f6bbe27bbecabd44f455720f994899e2aa))
* **exchange-rate:** API client and localStorage cache with offline fallback ([df2c4db](https://github.com/Endika/converthub/commit/df2c4dbe12cf0decb35b7370771b419d50a584af))
* **history,favorites,notes:** localStorage-backed bounded contexts ([8e1e477](https://github.com/Endika/converthub/commit/8e1e47756feb49169450e50a7e2a345549deb91e))
* **language:** EN/ES/EU i18n with observer-based language service ([5f6e388](https://github.com/Endika/converthub/commit/5f6e388918899615af91ec40fffec0ac593ce1db))
* **shared-kernel:** DDD base classes (ValueObject, Entity, AggregateRoot, Result, ports) ([afb4210](https://github.com/Endika/converthub/commit/afb42101a7d6f03740d19d99af240bd83cf5f110))
* **web:** vanilla UI with tabs, side panel, pinned currencies and PWA service worker ([6e61364](https://github.com/Endika/converthub/commit/6e613648a4484e58f1eb9c6faec81beea9dc9638))


### Bug Fixes

* **deploy:** build sw.js path with string concat, not URL constructor ([fbeabcf](https://github.com/Endika/converthub/commit/fbeabcf6794aafc4d1505b63c75aa8bc711bbe5f))
* **deploy:** use /converthub/ base path, clean dead asset refs, defer SW registration ([a5acc5a](https://github.com/Endika/converthub/commit/a5acc5a9cbb33212167356d5c332485889a2bc35))


### Chores

* **ci:** add dependabot and release-please workflows ([0b86d58](https://github.com/Endika/converthub/commit/0b86d58c57156ac0a65e4f743f3797b2e12ce156))
* project bootstrap (tooling, DDD scaffold, CI, prepared files) ([18c98de](https://github.com/Endika/converthub/commit/18c98de756af6c8a27a18920f5abd6c2015edb5d))
