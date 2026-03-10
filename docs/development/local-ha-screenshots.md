---
published: false
layout: docs
title: Local HA Screenshots
description: Real Home Assistant screenshot workflow for Universal Card docs, Pages assets, and production-ready example renders.
permalink: /development/local-ha-screenshots/
---

# Local HA Screenshots

This workflow renders Universal Card inside a real Home Assistant UI and captures docs-ready assets with Playwright.

## What It Uses

- Dockerized Home Assistant from `tests/ha-fixture/compose.yaml`
- Fixture Lovelace config from `tests/ha-fixture/config/configuration.yaml`
- Fixture dashboard views from `tests/ha-fixture/config/ui-lovelace.yaml`
- Built card assets synced into `${HA_FIXTURE_RUNTIME_DIR:-/tmp/universal-card-ha-fixture-config}/www/` before startup
- Playwright browser automation and a docs asset exporter

## Commands

### Raw screenshot workflow

```bash
npm run build
npm run ha:fixture:reset
npm run ha:fixture:bootstrap
npm run screenshots:ha
npm run ha:fixture:down
```

### Docs asset workflow

```bash
npm run build
npm run docs:assets:refresh
```

`docs:assets:refresh` bootstraps the fixture, captures production docs assets, and tears the fixture down automatically.

## Output

### Raw screenshots

Generated raw screenshots are written to `tests/screenshots/output/`.

Expected files from the base screenshot spec:

- `overview.png`
- `modes.png`
- `header-badges.png`
- `subview-details.png`

### Docs-ready assets

The docs exporter writes cropped dark-theme assets into `docs/img/`.

Expected outputs include:

- `basic-card-dark.png`
- `grid-layout-1.png`
- `grid-layout-2.png`
- `modal-open-dark.gif`
- `tabs-mode-dark.png`
- `carousel-mode-dark.png`
- `fullscreen-mode-dark.png`
- `subview-details-dark.png`
- `header-options.png`
- `footer.png`
- `visibility.png`
- `actions.png`
- `themes.png`
- `nested-cards.png`
- `editor-overview-dark.png`

## Why The Workflow Does Not Deep-Link With `page.goto()`

Home Assistant accepts the custom dashboard once the SPA shell is loaded, but hard-refreshing deep links like `/fixture-dashboard/modes` can trigger auth flow churn again.

The capture workflow therefore uses this path:

1. open `/`
2. authenticate or reuse trusted-network access
3. open the fixture dashboard from the sidebar
4. switch dashboard views with client-side routing

This keeps the run deterministic.

## Reset Behavior

`npm run ha:fixture:reset` removes generated Home Assistant state from `${HA_FIXTURE_RUNTIME_DIR:-/tmp/universal-card-ha-fixture-config}` by default.

The tracked fixture template remains in `tests/ha-fixture/config/`, which keeps the repository clean and makes onboarding reproducible.

## Execution Model

Screenshot generation is intentionally local-only.

Reasons:

1. Home Assistant frontend changes can introduce screenshot drift without any change in Universal Card.
2. GIF and cropped asset generation are expensive and noisy for standard CI feedback.
3. The docs pipeline is meant to be curated before committing generated assets into `docs/img/`.

Use the local Docker fixture workflow when screenshots or GIFs need to be refreshed.

## Limits

- Screenshot stability still depends on a fixed viewport and current Home Assistant frontend behavior.
- Some features such as `swipe`, `context_menu`, and loading strategy are behavior-heavy. They are documented with real renders where useful, but YAML and guidance remain the authoritative coverage surface.
