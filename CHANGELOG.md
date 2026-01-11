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

### TODO - Phase 1: Core
- [ ] Entry point (universal-card.js)
- [ ] Base UniversalCard class
- [ ] Config manager
- [ ] Skeleton loader
- [ ] Lazy loader (Intersection Observer)
- [ ] Error boundaries with popup
- [ ] Debug mode

### TODO - Phase 2: Header/Footer ✅
- [x] Flexible Header with slots (header_left, header_right, header.cards)
- [x] Optional Footer component
- [x] Header/Footer actions (tap, hold, double-tap)
- [x] Badges component with entity states, counters, thresholds
- [x] Sticky header
- [x] Header/Footer styles

### TODO - Phase 3: Body Modes
- [ ] CSS animations (GPU-accelerated)
- [ ] Expand mode
- [ ] CSS Grid with colspan/rowspan
- [ ] Modal mode
- [ ] Fullscreen mode
- [ ] Tabs mode
- [ ] Carousel mode
- [ ] Subview mode

### TODO - Phase 4: Features
- [ ] Visibility Conditions
- [ ] State-based theming
- [ ] Responsive breakpoints
- [ ] Swipe gestures
- [ ] Context Menu
- [ ] Radial Menu

### TODO - Phase 5: Advanced Features
- [ ] Entity Preview (hover sparkline)
- [ ] Alerts/Thresholds
- [ ] Quick Actions
- [ ] Timer/Countdown
- [ ] Custom Icon Mapping
- [ ] Animation Presets
- [ ] WebSocket Optimization

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
