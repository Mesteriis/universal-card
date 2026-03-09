---
title: Installation
description: HACS and manual installation paths for the frontend-only Lovelace card bundle.
section_label: Getting Started
permalink: /installation/
---

# Installation

## Important

- No backend integration is required.
- No `configuration.yaml` entry is required.
- The card is loaded as a Lovelace frontend resource.

## HACS

1. Open HACS.
2. Open the Frontend section.
3. Add this repository as a custom repository if needed.
4. Install `Universal Card`.
5. Refresh the browser cache.

## Manual

1. Copy `universal-card.js` and the `lazy/` directory into `/config/www/universal-card/`.
2. Add a Lovelace resource:
   - URL: `/local/universal-card/universal-card.js`
   - Type: `module`
3. Refresh the browser cache.

## Verify the resource

Use a minimal card first:

```yaml
type: custom:universal-card
title: Installation Check
body:
  cards:
    - type: markdown
      content: Universal Card loaded successfully
```

If the card renders, continue with the [configuration guide]({{ '/configuration/' | relative_url }}) or jump straight to the [examples gallery]({{ '/examples/' | relative_url }}).
