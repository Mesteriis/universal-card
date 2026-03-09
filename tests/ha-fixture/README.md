# Home Assistant Fixture

This fixture starts a real Home Assistant container for local screenshot generation against the built `universal-card.js` bundle.

## Prerequisites

1. Docker Desktop or another working Docker daemon.
2. Node dependencies installed with `npm install`.
3. A fresh local build from `npm run build`.

## Workflow

1. Run `npm run build`.
2. Run `npm run ha:fixture:reset` to remove generated Home Assistant state from `tests/ha-fixture/runtime/`.
3. Run `npm run ha:fixture:bootstrap`.
4. Run `npm run screenshots:ha`.
5. Stop the container with `npm run ha:fixture:down`.

Screenshots are written to `tests/screenshots/output/`.
Runtime Home Assistant state is written to `tests/ha-fixture/runtime/`.

## Why The Screenshot Spec Navigates Through The UI

Home Assistant custom dashboards in this fixture are reliable when opened through the loaded SPA shell. Hard-refreshing deep links like `/fixture-dashboard/modes` can restart the auth flow, so the Playwright spec:

1. logs in at `/`
2. opens the fixture dashboard from the sidebar
3. switches views with client-side routing

That makes the screenshot run stable and closer to a real user path.

## Credentials

Default local credentials:

- username: `fixture`
- password: `fixture-pass-123`

Override with environment variables if needed:

- `HA_FIXTURE_USERNAME`
- `HA_FIXTURE_PASSWORD`
- `HA_FIXTURE_URL`
- `HA_IMAGE`
