# Installation

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
