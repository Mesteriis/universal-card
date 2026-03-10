---
title: Custom CSS Recipes
description: Ready-to-use custom_css snippets for common Universal Card styling tasks.
section_label: Features
permalink: /features/custom-css-recipes/
---

# Custom CSS Recipes

`custom_css` is supported and is the right tool when themes and `theme_tokens` are not enough.
Use it to restyle the card's own internal elements.

<div class="docs-callout">
  <strong>Scope note.</strong> `custom_css` styles are injected into the card's shadow root. The practical target is the card itself and its internal elements. Treat `global` as unprefixed shadow-root CSS, not as a whole-page stylesheet.
</div>

<div class="docs-callout">
  <strong>Hook preference.</strong> For new overrides, prefer the stable <code>data-uc-*</code> hooks documented in <a href="{{ '/features/selector-catalog/' | relative_url }}">Selector Catalog</a> instead of relying only on class names.
</div>

## Scope Quick Reference

| Scope | Best for |
| --- | --- |
| `card` | shell styling, borders, backgrounds, spacing |
| `header` | title, subtitle, badges, slot layout |
| `body` | body wrappers, grids, nested card spacing |
| `footer` | footer text, actions, slot alignment |
| `global` | unprefixed selectors inside the card shadow root |

## Recipe: Sharper card border

```yaml
custom_css:
  - scope: card
    css: |
      .universal-card {
        border: 1px solid rgba(124, 214, 255, 0.28);
      }
```

## Recipe: Stronger glass surface

```yaml
custom_css:
  - scope: card
    css: |
      .universal-card {
        backdrop-filter: blur(18px);
        background: linear-gradient(145deg, rgba(11,18,31,.92), rgba(20,37,55,.88));
      }
```

## Recipe: Uppercase header title

```yaml
custom_css:
  - scope: header
    css: |
      .header-title {
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
```

## Recipe: Uppercase header title with stable hooks

```yaml
custom_css:
  - scope: header
    css: |
      [data-uc-role="title"] {
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
```

## Recipe: Accent subtitle

```yaml
custom_css:
  - scope: header
    css: |
      .header-subtitle {
        color: #7cd6ff;
      }
```

## Recipe: Bigger main icon

```yaml
custom_css:
  - scope: header
    css: |
      .header-icon {
        --mdc-icon-size: 30px;
      }
```

## Recipe: More air between title and subtitle

```yaml
custom_css:
  - scope: header
    css: |
      .header-content {
        gap: 6px;
      }
```

## Recipe: Right-side badges wrap instead of staying in one row

```yaml
custom_css:
  - scope: header
    css: |
      .header-badges {
        flex-wrap: wrap;
        justify-content: flex-end;
      }
```

## Recipe: Icon-only badges with round chips

```yaml
custom_css:
  - scope: header
    css: |
      .badge.icon-only {
        width: 30px;
        height: 30px;
        justify-content: center;
        border-radius: 999px;
      }
```

## Recipe: Larger badge values

```yaml
custom_css:
  - scope: header
    css: |
      .badge-value {
        font-size: 12px;
        font-weight: 700;
      }
```

## Recipe: Quiet secondary badges

```yaml
custom_css:
  - scope: header
    css: |
      .badge {
        opacity: 0.82;
      }
      .badge:hover {
        opacity: 1;
      }
```

## Recipe: Tighter body spacing

```yaml
custom_css:
  - scope: body
    css: |
      .body-content {
        gap: 8px;
      }
```

## Recipe: Emphasize each body card wrapper

```yaml
custom_css:
  - scope: body
    css: |
      .card-wrapper {
        border-radius: 14px;
        overflow: hidden;
      }
```

## Recipe: Tabs with pill buttons

```yaml
custom_css:
  - scope: body
    css: |
      .tab-button {
        border-radius: 999px;
        background: rgba(255,255,255,.04);
      }
      .tab-button.active {
        background: rgba(124,214,255,.12);
      }
```

## Recipe: Carousel arrows with stronger contrast

```yaml
custom_css:
  - scope: body
    css: |
      .carousel-arrow {
        background: rgba(5,10,18,.72);
        border: 1px solid rgba(255,255,255,.12);
      }
```

## Recipe: Modal grid with tighter columns

```yaml
custom_css:
  - scope: body
    css: |
      .uc-modal-grid {
        gap: 10px;
      }
```

## Recipe: Fullscreen content with wider breathing room

```yaml
custom_css:
  - scope: body
    css: |
      .uc-fullscreen-content {
        padding: 24px;
      }
```

## Recipe: Footer actions as pills

```yaml
custom_css:
  - scope: footer
    css: |
      .footer-action-btn {
        border-radius: 999px;
        padding-inline: 12px;
      }
```

## Recipe: Quiet footer text

```yaml
custom_css:
  - scope: footer
    css: |
      .footer-text {
        opacity: 0.78;
        font-size: 12px;
      }
```

## Recipe: Header and footer together

```yaml
custom_css:
  - scope: header
    css: |
      .header-title {
        letter-spacing: 0.06em;
      }
  - scope: footer
    css: |
      .footer-action-btn {
        border-radius: 999px;
      }
```

## Safety Limits

Blocked selectors:

- `body`
- `html`
- `:root`
- `head`
- `script`

Blocked properties:

- `behavior`
- `expression`
- `-moz-binding`

Also:

- `@import` is stripped
- CSS is sanitized before injection

## Related Docs

- [Selector Catalog]({{ '/features/selector-catalog/' | relative_url }})
- [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }})
- [Examples Gallery]({{ '/examples/' | relative_url }})
