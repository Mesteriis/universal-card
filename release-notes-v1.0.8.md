## What's fixed

- Prefer the active HACS bundle URL when both HACS and legacy `/universal_card_static` resources are present in the frontend.
- Keep the existing fallback order for manual installs and legacy layouts.
- Add coverage for mixed-resource installs so lazy editor bundles resolve from the correct base URL.

## Why this release matters

Some upgraded dashboards could still try to lazy-load editor bundles from `/universal_card_static/...` if an older manual resource was left behind in the browser or dashboard config. This release hardens runtime bundle URL detection so HACS installs continue loading lazy modules from `/hacsfiles/universal-card/...`.
