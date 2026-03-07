# Configuration

`Universal Card` is a frontend integration that serves `universal-card.js` and lazy bundles through Home Assistant.

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
