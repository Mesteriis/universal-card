# Home Assistant Fixture

This fixture starts a real Home Assistant container for local screenshot generation and Pages asset capture.

## Files

- `config/` contains the tracked fixture template.
- `compose.yaml` starts the container.
- runtime Home Assistant state is written to `${HA_FIXTURE_RUNTIME_DIR:-/tmp/universal-card-ha-fixture-config}` by default.

## Workflow

### Base screenshot workflow

1. Run `npm run build`.
2. Run `npm run ha:fixture:reset` to remove generated Home Assistant state from `${HA_FIXTURE_RUNTIME_DIR:-/tmp/universal-card-ha-fixture-config}`.
3. Run `npm run ha:fixture:bootstrap`.
4. Run `npm run screenshots:ha`.
5. Stop the container with `npm run ha:fixture:down`.

### Docs asset workflow

1. Run `npm run build`.
2. Run `npm run docs:assets:refresh`.

The docs asset workflow bootstraps the fixture, captures cropped dark-theme docs assets into `docs/img/`, and stops the fixture automatically.

## Outputs

- raw screenshots: `tests/screenshots/output/`
- docs-ready assets: `docs/img/`

## Why The Screenshot Spec Navigates Through The UI

Home Assistant reloads auth state more reliably when the SPA shell is opened first and the dashboard is reached through client-side navigation.

That is why the browser flow does this instead of hard-refreshing deep links:

1. open `/`
2. authenticate or reuse trusted-network bypass
3. enter the fixture dashboard from the sidebar
4. change views through the router

## Reset Behavior

`npm run ha:fixture:reset` only removes generated runtime state.
The tracked template in `tests/ha-fixture/config/` remains unchanged.
