# Changelog

## [1.5.0](https://github.com/Endika/converthub/compare/v1.4.1...v1.5.0) (2026-05-20)


### Features

* **ui:** brand icon with violet gradient and swap arrows ([495a504](https://github.com/Endika/converthub/commit/495a50431c59dd8263cf7e154bd018871d7d2688))
* **ui:** swap from/to button in all unit converters and live result in favorites ([1b5f0d6](https://github.com/Endika/converthub/commit/1b5f0d6fd8c7d85d3d8c4225df6eb085683dc65e))


### Bug Fixes

* **ui:** history items render on a single line (flex layout for triple action) ([b30601c](https://github.com/Endika/converthub/commit/b30601c1dc6d0c6fd4d403900c07fc234a961936))

## [1.4.1](https://github.com/Endika/converthub/compare/v1.4.0...v1.4.1) (2026-05-20)


### Bug Fixes

* **ui:** cap displayed amounts to 3 decimals (no trailing zeros) everywhere ([7021fe9](https://github.com/Endika/converthub/commit/7021fe913d61aeaff8039cf046422fc305b90b75))

## [1.4.0](https://github.com/Endika/converthub/compare/v1.3.0...v1.4.0) (2026-05-20)


### Features

* **ui:** own favicon, amount-aware favorites, clickable history entries, hover polish ([25e2eda](https://github.com/Endika/converthub/commit/25e2eda0d27b2050cc4cb53114f345c6dae4a705))

## [1.3.0](https://github.com/Endika/converthub/compare/v1.2.0...v1.3.0) (2026-05-20)


### Features

* **ui:** clicking a favorite loads its pair into the active converter ([5eda6dd](https://github.com/Endika/converthub/commit/5eda6dd14ba09b039d7b3aea94bd984a9c4262db))


### Bug Fixes

* **ui:** responsive layout for mobile and tablet breakpoints ([83c799f](https://github.com/Endika/converthub/commit/83c799f05ec7d7cd73392d20614c64dff429494c))


### Documentation

* link live demo and align README with current stack (vitest 4, eslint 10, ts 6, PWA via vite-plugin-pwa) ([9b6be65](https://github.com/Endika/converthub/commit/9b6be651c742c17bcace0a1f43015ce5545e5c93))

## [1.2.0](https://github.com/Endika/converthub/compare/v1.1.0...v1.2.0) (2026-05-20)


### Features

* **pwa:** integrate vite-plugin-pwa with workbox for installable offline-first app ([379c8f5](https://github.com/Endika/converthub/commit/379c8f59db58fa5eec5715566e7fa3bfcd80a5cb))


### Bug Fixes

* **deps:** align vitest 4 across coverage/ui, group related deps in dependabot ([e346268](https://github.com/Endika/converthub/commit/e3462687660b32778ea648f9699f2233fc49fcc4))


### Chores

* **ci:** bump actions/checkout from 4 to 6 ([1693ee1](https://github.com/Endika/converthub/commit/1693ee1554db0d9c7ae9d7cd88d2fddc51d49fe2))
* **ci:** bump actions/configure-pages from 5 to 6 ([3843acd](https://github.com/Endika/converthub/commit/3843acd741b15d909b3db35c0d47349f46428ded))
* **ci:** bump actions/deploy-pages from 4 to 5 ([323fedd](https://github.com/Endika/converthub/commit/323fedd930ca37272be4766a43e23e71c14935dc))
* **ci:** bump actions/download-artifact from 4 to 8 ([927f572](https://github.com/Endika/converthub/commit/927f572d60e6b91654b1b0ff6247b18e25ff5b7e))
* **ci:** bump actions/setup-node from 4 to 6 ([56c37b1](https://github.com/Endika/converthub/commit/56c37b12feebfe56336de80e720a8062766213e3))
* **ci:** bump actions/upload-artifact from 4 to 7 ([97bd96a](https://github.com/Endika/converthub/commit/97bd96aed659ac8d33bfac48f18fbfd91b6b75df))
* **ci:** bump actions/upload-pages-artifact from 3 to 5 ([d5489d6](https://github.com/Endika/converthub/commit/d5489d682b79a5170443d60d5d8ad7c61c78928a))
* **ci:** bump googleapis/release-please-action from 4 to 5 ([7af5eae](https://github.com/Endika/converthub/commit/7af5eaeb9627b0c62cb37f56d683df1e8ac446cc))
* **deps-dev:** bump @types/node from 22.19.19 to 25.9.1 ([144a115](https://github.com/Endika/converthub/commit/144a1151a14f5d3b34033d1a671b76da76707b57))
* **deps-dev:** bump @vitest/coverage-v8 from 3.2.4 to 4.1.7 ([481de7e](https://github.com/Endika/converthub/commit/481de7e6601c91258488175e3e0bfddba1a5a290))
* **deps-dev:** bump @vitest/ui from 3.2.4 to 4.1.7 ([5f0c096](https://github.com/Endika/converthub/commit/5f0c096b7e2837b664cd64374231f27d345c518e))
* **deps-dev:** bump eslint from 9.39.4 to 10.4.0 ([bfb32ba](https://github.com/Endika/converthub/commit/bfb32ba7a22a862fb2da34b562f4ea4999e9b55c))
* **deps-dev:** bump happy-dom from 15.11.7 to 20.9.0 ([40c51a4](https://github.com/Endika/converthub/commit/40c51a43f709f20a6f9f21ce2d9c08a4df3a5612))
* **deps-dev:** bump typescript from 5.9.3 to 6.0.3 ([30cb71a](https://github.com/Endika/converthub/commit/30cb71ab99ab98afae5ec3ac0a6282726622c45f))
* **deps-dev:** bump vitest from 3.2.4 to 4.1.7 ([ec50896](https://github.com/Endika/converthub/commit/ec508965ec2e0f2a9f8b87f7ded50ba74926764a))
* exempt release-please artifacts from prettier ([6e02977](https://github.com/Endika/converthub/commit/6e029774bf4754adf6753f7adcaf0f19e8971eb7))

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
