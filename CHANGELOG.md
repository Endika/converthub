# Changelog

## [1.9.3](https://github.com/Endika/converthub/compare/v1.9.2...v1.9.3) (2026-05-22)


### Bug Fixes

* **ci:** parse release-please pr payload in run script, not env ([2fbcf3a](https://github.com/Endika/converthub/commit/2fbcf3a1d8062227f915cf53a2102dc9b228b8a7))

## [1.9.2](https://github.com/Endika/converthub/compare/v1.9.1...v1.9.2) (2026-05-22)


### Bug Fixes

* **ci:** also delete the release-please head branch after auto-merge ([f73d2c1](https://github.com/Endika/converthub/commit/f73d2c138e21dbae4a168052747f7f44c6a7e7b8))

## [1.9.1](https://github.com/Endika/converthub/compare/v1.9.0...v1.9.1) (2026-05-22)


### Bug Fixes

* **ci:** grant actions: write to enable workflow_dispatch self-rearm ([6e1a076](https://github.com/Endika/converthub/commit/6e1a076a5a74b83a24833378c6625f893ab765c3))

## [1.9.0](https://github.com/Endika/converthub/compare/v1.8.0...v1.9.0) (2026-05-22)


### Features

* **ci:** deploy to Pages on release, not on every push ([ee37e8f](https://github.com/Endika/converthub/commit/ee37e8f42bd22c6a8862a21083309727bb13f0d5))

## [1.8.0](https://github.com/Endika/converthub/compare/v1.7.2...v1.8.0) (2026-05-22)


### Features

* **rates:** add open.er-api and fawazahmed0 as rate providers ([f8fbd2f](https://github.com/Endika/converthub/commit/f8fbd2f8d6db331d427144cd1ed09b8b53d518fc))

## [1.7.2](https://github.com/Endika/converthub/compare/v1.7.1...v1.7.2) (2026-05-22)


### Bug Fixes

* **ci:** re-trigger release-please via workflow_dispatch after auto-merge ([f38a966](https://github.com/Endika/converthub/commit/f38a9663338a86aafa407f75b0727b36bec1b135))

## [1.7.1](https://github.com/Endika/converthub/compare/v1.7.0...v1.7.1) (2026-05-22)


### Bug Fixes

* **ci:** delete PR branch on close regardless of merge state ([3919e1d](https://github.com/Endika/converthub/commit/3919e1d8aebab5bc6a57004f46c56019baa43456))
* **pwa:** cache frankfurter.app responses in the service worker ([b04b144](https://github.com/Endika/converthub/commit/b04b144ee508061b87c0fc62ef2381df3ac1a311))
* **rates:** point Frankfurter adapter to api.frankfurter.dev ([af9dca6](https://github.com/Endika/converthub/commit/af9dca6b7ab1524741ff5bc502305bfa7aa7dea4))

## [1.7.0](https://github.com/Endika/converthub/compare/v1.6.2...v1.7.0) (2026-05-22)


### Features

* **rates,tip:** money favorites chips, currency names, frankfurter provider, settings tab ([bbaf141](https://github.com/Endika/converthub/commit/bbaf14135099cca6ffebd3e0f56195c70cf2cced))

## [1.6.2](https://github.com/Endika/converthub/compare/v1.6.1...v1.6.2) (2026-05-22)


### Documentation

* **license:** add MIT LICENSE file ([4310615](https://github.com/Endika/converthub/commit/43106153d653dadf00be8dc67777f347e7db552c))

## [1.6.1](https://github.com/Endika/converthub/compare/v1.6.0...v1.6.1) (2026-05-22)


### Bug Fixes

* **release:** pass -R repo to gh pr merge ([1e86237](https://github.com/Endika/converthub/commit/1e862377592fa13420782b612f37b009b95346e0))


### Documentation

* **readme:** align structure with kartaak and mintza ([a7e76b3](https://github.com/Endika/converthub/commit/a7e76b3975c7a751d5cc1902df88ed24fc31e5d0))


### Chores

* **release:** auto-merge release-please PRs ([50f0520](https://github.com/Endika/converthub/commit/50f05203ee8477ba99cf1243f2cab591239973b6))

## [1.6.0](https://github.com/Endika/converthub/compare/v1.5.2...v1.6.0) (2026-05-21)


### Features

* **i18n:** add tip calculator strings in en/es/eu ([543ee56](https://github.com/Endika/converthub/commit/543ee569c0565bcb0d70cd7ab4bcfe6c98ac5834))
* **tipping:** add CalculateTipUseCase composing calculator and rate port ([876ecd0](https://github.com/Endika/converthub/commit/876ecd0dfe40e7805ca7fd352bffa3f0b841e7b3))
* **tipping:** add default tip percent per currency catalog ([1e68b62](https://github.com/Endika/converthub/commit/1e68b6213c929f448e49eb02462741e3b74fcf5c))
* **tipping:** add InvalidTipInputError and TipCalculation types ([938c2dd](https://github.com/Endika/converthub/commit/938c2dd137375bbd09ff4656b0b90e5fba0dee9a))
* **tipping:** add RateConverterPort and ExchangeRate adapter ([2f9efde](https://github.com/Endika/converthub/commit/2f9efdeb3e8c278d92531f04bb2d529995b060c4))
* **tipping:** add TipCalculator domain service ([255c7a9](https://github.com/Endika/converthub/commit/255c7a91e2dbeb1f2f010c503a723caed64f2a16))
* **tipping:** register tip calculator services in DI container ([9fb963d](https://github.com/Endika/converthub/commit/9fb963d0db88f745e7983c779a90f86b788cd9d1))
* **ui:** add tip calculator component with dual-currency output ([028f639](https://github.com/Endika/converthub/commit/028f639b8dfcded2dbf63deb68eab31cfec3ef34))
* **ui:** register tip calculator tab in HomePage ([bf9a457](https://github.com/Endika/converthub/commit/bf9a457ef8ae15a3d06d71d5058e37b69f47b617))
* **ui:** show app version in bottom-right footer ([d853146](https://github.com/Endika/converthub/commit/d853146ce6afd77c67c836076bab738441226cdc))


### Bug Fixes

* **ui:** keep tip result rows blank when no bill is entered ([a11c720](https://github.com/Endika/converthub/commit/a11c7202b8ec7b499939d26c45ac2d5fe3ae8225))


### Documentation

* rewrite README around the traveller use case ([b279894](https://github.com/Endika/converthub/commit/b27989422b78da8f16a240be0ed75442b90a04b7))


### Chores

* **build:** expose package version as __APP_VERSION__ ([dd51c40](https://github.com/Endika/converthub/commit/dd51c40009a120961cf01a50016aa6a2e6bc852e))

## [1.5.2](https://github.com/Endika/converthub/compare/v1.5.1...v1.5.2) (2026-05-20)


### Chores

* remove unused empty infra dirs (http, storage) ([cfd2b52](https://github.com/Endika/converthub/commit/cfd2b52cfd8e909961bb32146dd8d22d05e519ea))

## [1.5.1](https://github.com/Endika/converthub/compare/v1.5.0...v1.5.1) (2026-05-20)


### Bug Fixes

* **ui:** replace curved swap icon with straight horizontal arrows ([317117e](https://github.com/Endika/converthub/commit/317117e8f7db6412797088d34f9808be24cd8755))

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
