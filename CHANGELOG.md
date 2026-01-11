# Changelog

All notable changes to Universal Card will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ✅ Initial project structure
- ✅ HACS integration (manifest.json, hacs.json, __init__.py)
- ✅ Git repository setup
- ✅ Entry point (universal-card.js)
- ✅ Core: UniversalCard class with Shadow DOM
- ✅ Core: UniversalCardEditor (visual editor)
- ✅ Core: ConfigManager with validation
- ✅ Core: Constants (body modes, themes, actions, etc.)
- ✅ Utils: helpers (deep merge, fire event, etc.)
- ✅ Utils: performance (debounce, throttle, RAF)
- ✅ Utils: ha-helpers (card creation, state access)
- ✅ README with full documentation
- ✅ LICENSE (MIT)

### TODO - Phase 1: Core ✅
- [x] Entry point (universal-card.js)
- [x] Base UniversalCard class
- [x] Config manager with validation
- [x] Skeleton loader
- [x] Lazy loader (Intersection Observer)
- [x] Error boundaries with popup (in BaseMode)
- [ ] Debug mode (deferred to Phase 10)

### TODO - Phase 2: Header/Footer ✅
- [x] Flexible Header with slots (header_left, header_right, header.cards)
- [x] Optional Footer component
- [x] Header/Footer actions (tap, hold, double-tap)
- [x] Badges component with entity states, counters, thresholds
- [x] Sticky header
- [x] Header/Footer styles

### TODO - Phase 3: Body Modes ✅
- [x] CSS animations (GPU-accelerated)
- [x] Expand mode with staggered card animations
- [x] CSS Grid with colspan/rowspan
- [x] Modal mode with backdrop blur
- [x] Fullscreen mode with slide-up animation
- [x] Tabs mode with indicator
- [x] Carousel mode with swipe & autoplay
- [ ] Subview mode (deferred)

### TODO - Phase 4: Features ✅
- [x] Visibility Conditions (state, numeric, user, time, screen, and/or/not)
- [x] State-based theming (colors, backgrounds, thresholds)
- [x] Responsive breakpoints (media queries, container queries)
- [x] Swipe gestures (horizontal, vertical, configurable threshold)
- [x] Context Menu (right-click, icons, separators)
- [x] Radial Menu (long press, circular layout)

### TODO - Phase 5: Advanced Features ✅
- [x] Entity Preview (hover sparkline with history)
- [x] Alerts/Thresholds system (notifications, sounds, services)
- [x] Quick Actions (toggle, service calls, navigation, etc.)
- [x] Timer/Countdown (multiple modes, formats, controls)
- [x] Custom Icon Mapping (presets for all domains)
- [x] Animation Presets (30+ animations, categories, stagger)
- [x] WebSocket Optimization (throttling, batching, visibility)

### TODO - Phase 6: Complex Features ✅
- [x] Card Linking (master/slave synchronization, events, groups)
- [x] Entity Auto-grouping (7 strategies: domain, area, device, floor, label, state, custom)
- [x] Compact Mode (5 levels, auto-trigger, responsive)

### TODO - Phase 7: Themes & Effects ✅
- [x] Glassmorphism Theme (7 presets, 4 color schemes)
- [x] Neumorphism Theme (6 types, 5 intensities, 6 palettes)
- [x] Background Patterns (20+ patterns, 6 categories)
- [x] Border Animations (8 types: gradient, glow, neon, shimmer)
- [x] Hover Effects Library (20+ effects, 6 categories)
- [x] Loading Variants (10 types, 5 sizes)
- [x] Micro-interactions (ripple, confetti, checkmark, shake)
- [x] Color Schemes (15 schemes: light, dark, neon, cyberpunk)

### TODO - Phase 8: Widgets & Integration ✅
- [x] REST API Widget (GET/POST, caching, transforms, auto-refresh)
- [x] Image Entity (camera, image, person, lazy loading, fullscreen)
- [x] Media Player Mini (controls, progress, volume, sources)
- [x] Notification Center (persistent notifications, grouping, dismiss)

### TODO - Phase 9: Editor ✅
- [x] ConfigValidator (schema validation, autocomplete, suggestions)
- [x] DragDrop (reorder cards with drag & drop)
- [x] ResizableCards (resize cards with handles)
- [x] LockMode (lock cards from accidental changes)
- [x] EditorComponents (TextInput, NumberInput, Checkbox, Select, EntityPicker, IconPicker, ColorPicker, Section, ActionEditor)
- [x] MultiLanguage (i18n support: EN, RU, ES, DE + more)

### TODO - Phase 10: Developer Tools ✅
- [x] EventLogger (levels, categories, grouping, panel UI, export)
- [x] StateInspector (hass, config, internal state, live editing)
- [x] PerformanceProfiler (render times, FPS, memory, charts)

### TODO - Phase 11: Extensibility ✅
- [x] PluginSystem (hooks, priorities, lifecycle, createPlugin helper)
- [x] CustomCSS (scopes, sanitization, variables, helpers)
- [x] Multi-language (i18n) - уже реализовано в Phase 9 (MultiLanguage.js)

---

## [1.0.0] - TBD

### Added
- First stable release
