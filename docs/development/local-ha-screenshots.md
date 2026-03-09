---
layout: docs
title: Local HA Screenshots
description: Real Home Assistant screenshot workflow for Universal Card docs and examples.
permalink: /development/local-ha-screenshots/
---

# Local HA Screenshots

This workflow renders Universal Card inside a real Home Assistant UI and captures screenshots with Playwright.

## What It Uses

- Dockerized Home Assistant from `tests/ha-fixture/compose.yaml`
- Fixture Lovelace config from `tests/ha-fixture/config/configuration.yaml`
- Fixture dashboard views from `tests/ha-fixture/config/ui-lovelace.yaml`
- Built card assets synced into `tests/ha-fixture/runtime/config/www/` before startup
- Playwright browser automation from `tests/screenshots/home-assistant.spec.ts`

## Commands

```bash
npm run build
npm run ha:fixture:reset
npm run ha:fixture:bootstrap
npm run screenshots:ha
npm run ha:fixture:down
```

## Output

Generated screenshots are written to `tests/screenshots/output/`.

Expected files from the current fixture:

- `overview.png`
- `modes.png`
- `header-badges.png`
- `subview-details.png`

## Why The Test Does Not Deep-Link With `page.goto()`

Home Assistant accepts the custom dashboard once the SPA shell is loaded, but hard-refreshing deep links like `/fixture-dashboard/modes` can trigger the login flow again.

The screenshot spec therefore uses this path:

1. open `/`
2. authenticate
3. open the fixture dashboard from the sidebar
4. switch dashboard views with client-side routing

This is intentional. It avoids auth churn and keeps the screenshot run deterministic.

## Reset Behavior

`npm run ha:fixture:reset` removes generated Home Assistant state from `tests/ha-fixture/runtime/`.

The tracked fixture template remains in `tests/ha-fixture/config/`, which keeps the repository clean and guarantees a reproducible onboarding flow.

## Limits

- This is a local workflow. It does not yet upload artifacts from CI.
- The fixture uses demo-style helper entities and is meant for documentation screenshots, not for broad HA integration coverage.
- Screenshot stability still depends on a fixed viewport and current Home Assistant frontend behavior.

## Next Step For CI

The same fixture can be moved into GitHub Actions later:

1. build the card bundle
2. start the fixture container
3. wait for Home Assistant readiness
4. run the same Playwright screenshot spec
5. upload `tests/screenshots/output/` as workflow artifacts
