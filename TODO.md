# Universal Card - Development TODO

## Current Sprint: Phase 5 - Advanced Features

### ✅ Completed - Phase 1: Core
- [x] Project structure
- [x] HACS integration files
- [x] Git repository setup
- [x] Entry point (universal-card.js)
- [x] Base UniversalCard class
- [x] Config manager with validation
- [x] Skeleton loader component
- [x] Lazy loader with Intersection Observer
- [x] Error boundaries with popup

### ✅ Completed - Phase 2: Header/Footer
- [x] Header component with slots (header_left, header_right, header.cards)
- [x] Footer component
- [x] Badges component (entity states, counters, thresholds)
- [x] Header/Footer actions (tap, hold, double-tap)
- [x] Sticky header
- [x] Header/Footer styles

### ✅ Completed - Phase 3: Body Modes
- [x] BaseMode abstract class
- [x] Expand mode with staggered animations
- [x] Modal mode with backdrop blur
- [x] Fullscreen mode with slide-up
- [x] Tabs mode with indicator
- [x] Carousel mode with swipe & autoplay
- [x] CSS Grid with colspan/rowspan
- [x] GPU-accelerated CSS animations

### ✅ Completed - Phase 4: Features
- [x] Visibility Conditions (state, numeric, user, time, screen, and/or/not)
- [x] State-based theming (colors, backgrounds, thresholds)
- [x] Responsive breakpoints (media queries, container queries)
- [x] Swipe gestures (horizontal, vertical, configurable threshold)
- [x] Context Menu (right-click with icons)
- [x] Radial Menu (long press, circular layout)

### ✅ Completed - Phase 5: Advanced Features
- [ ] Entity Preview (hover sparkline)
- [ ] Alerts/Thresholds system
- [ ] Quick Actions
- [ ] Timer/Countdown
- [ ] Custom Icon Mapping
- [ ] Animation Presets
- [ ] WebSocket Optimization

### ⏳ Pending - Phase 6: Complex Features
- [ ] Card Linking (master/slave)
- [ ] Entity Auto-grouping
- [ ] Compact Mode

### ⏳ Pending - Phase 7: Themes & Effects
- [ ] Glassmorphism Theme
- [ ] Neumorphism Theme
- [ ] Background Patterns
- [ ] Border Animations
- [ ] Hover Effects Library
- [ ] Loading Variants
- [ ] Micro-interactions
- [ ] Color Schemes

### ⏳ Pending - Phase 8: Widgets & Integration
- [ ] REST API Widget
- [ ] Image Entity
- [ ] Media Player Mini
- [ ] Notification Center

### ⏳ Pending - Phase 9: Editor
- [ ] Visual Editor improvements
- [ ] Config Validation in UI
- [ ] Drag & Drop Reorder
- [ ] Resizable Cards
- [ ] Lock Mode

### ⏳ Pending - Phase 10: Developer Tools
- [ ] Event Logger
- [ ] State Inspector
- [ ] Performance Profiler
- [ ] Debug mode

### ⏳ Pending - Phase 11: Extensibility
- [ ] Plugin System
- [ ] Custom CSS Injection
- [ ] Multi-language (i18n)

---

## Architecture Decisions

### Design Principles
1. **SOLID** - Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
2. **DRY** - Don't Repeat Yourself
3. **KISS** - Keep It Simple, Stupid
4. **YAGNI** - You Aren't Gonna Need It (добавляем только когда нужно)

### Code Style
- ES6+ modules
- JSDoc comments for all public methods
- Consistent naming: camelCase for variables/functions, PascalCase for classes
- Max line length: 100 characters
- 2 spaces indentation

### Performance Goals
- First render < 50ms
- Re-render < 16ms (60fps)
- Memory: < 5MB per card instance
- Support 50+ cards on single page without lag

---

## File Structure

```
universal_card/
├── __init__.py           ✅ Done
├── manifest.json         ✅ Done
├── hacs.json            ✅ Done
├── CHANGELOG.md         ✅ Done
├── TODO.md              ✅ Done
├── README.md            ✅ Done
├── LICENSE              ✅ Done
├── universal-card.js    ✅ Done
├── core/
│   ├── index.js              ✅ Done
│   ├── constants.js          ✅ Done
│   ├── config.js             ✅ Done
│   ├── UniversalCard.js      ✅ Done
│   └── UniversalCardEditor.js ✅ Done
├── modes/
│   ├── index.js              ✅ Done
│   ├── BaseMode.js           ✅ Done
│   ├── ExpandMode.js         ✅ Done
│   ├── ModalMode.js          ✅ Done
│   ├── FullscreenMode.js     ✅ Done
│   ├── TabsMode.js           ✅ Done
│   └── CarouselMode.js       ✅ Done
├── features/
│   ├── index.js              ✅ Done
│   ├── VisibilityConditions.js ✅ Done
│   ├── StateStyles.js        ✅ Done
│   ├── SwipeGestures.js      ✅ Done
│   └── ResponsiveBreakpoints.js ✅ Done
├── ui/
│   ├── index.js              ✅ Done
│   ├── Header.js             ✅ Done
│   ├── Footer.js             ✅ Done
│   ├── Badges.js             ✅ Done
│   ├── ContextMenu.js        ✅ Done
│   └── RadialMenu.js         ✅ Done
├── styles/
│   ├── index.js              ✅ Done
│   └── header-footer.js      ✅ Done
├── utils/
│   ├── index.js              ✅ Done
│   ├── helpers.js            ✅ Done
│   ├── performance.js        ✅ Done
│   └── ha-helpers.js         ✅ Done
├── advanced/                 🔄 Phase 5
│   ├── EntityPreview.js      ⏳ Pending
│   ├── Alerts.js             ⏳ Pending
│   ├── QuickActions.js       ⏳ Pending
│   ├── Timer.js              ⏳ Pending
│   ├── IconMapping.js        ⏳ Pending
│   └── AnimationPresets.js   ⏳ Pending
├── widgets/                  ⏳ Phase 8
├── editor/                   ⏳ Phase 9
├── plugins/                  ⏳ Phase 11
├── dev/                      ⏳ Phase 10
└── i18n/                     ⏳ Phase 11
```

---

## Notes

### 2026-01-11 - Phase 5 Started
- Starting Advanced Features phase
- Focus on Entity Preview, Alerts, Quick Actions, Timer

### 2026-01-11 - Phase 4 Completed
- Visibility Conditions with complex logic
- State-based theming
- Responsive breakpoints
- Swipe gestures
- Context Menu (right-click)
- Radial Menu (long press)

### 2026-01-11 - Phase 3 Completed
- All body modes implemented
- BaseMode class for code reuse
- Error boundaries with popup

### 2026-01-11 - Phase 2 Completed
- Header/Footer components
- Badges with entity states
- Actions (tap, hold, double-tap)

### 2026-01-11 - Phase 1 Completed
- Initial setup complete
- Git repository on GitHub
