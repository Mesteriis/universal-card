# Configuration

`Universal Card` is a frontend-only Lovelace custom card.

## Important
- No backend integration is required.
- No `configuration.yaml` entry is required.
- The card is loaded as a Lovelace resource.

## Minimal example

```yaml
type: custom:universal-card
title: Example
body:
  cards:
    - type: markdown
      content: Hello
```

## Development structure
- Production source: `src/`
- Tests: `tests/`
- Bundles: `universal-card.js`, `lazy/*.js`
- Release automation: `.github/workflows/release.yml`
