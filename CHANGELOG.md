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

### TODO - Phase 6: Complex Features
- [ ] Card Linking (master/slave)
- [ ] Entity Auto-grouping
- [ ] Compact Mode

### TODO - Phase 7: Themes & Effects
- [ ] Glassmorphism Theme
- [ ] Neumorphism Theme
- [ ] Background Patterns
- [ ] Border Animations
- [ ] Hover Effects Library
- [ ] Loading Variants
- [ ] Micro-interactions
- [ ] Color Schemes

### TODO - Phase 8: Widgets & Integration
- [ ] REST API Widget
- [ ] Image Entity
- [ ] Media Player Mini
- [ ] Notification Center

### TODO - Phase 9: Editor
- [ ] Visual Editor
- [ ] Config Validation
- [ ] Drag & Drop Reorder
- [ ] Resizable Cards
- [ ] Lock Mode

### TODO - Phase 10: Developer Tools
- [ ] Event Logger
- [ ] State Inspector
- [ ] Performance Profiler

### TODO - Phase 11: Extensibility
- [ ] Plugin System
- [ ] Custom CSS Injection
- [ ] Multi-language (i18n)

---

## [1.0.0] - TBD

### Added
- First stable release
