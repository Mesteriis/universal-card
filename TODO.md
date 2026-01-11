# Universal Card - Development TODO

## Current Sprint: Phase 3 - Body Modes

### ✅ Completed - Phase 1: Core
- [x] Project structure
- [x] HACS integration files
- [x] Git repository setup
- [x] Entry point (universal-card.js)
- [x] Base UniversalCard class
- [x] Config manager with validation
- [x] Skeleton loader component
- [x] Lazy loader with Intersection Observer

### ✅ Completed - Phase 2: Header/Footer
- [x] Header component with slots
- [x] Footer component
- [x] Badges component
- [x] Header/Footer actions (tap, hold, double-tap)
- [x] Sticky header
- [x] Header/Footer styles

### 🔄 In Progress - Phase 3: Body Modes
- [ ] Expand mode (basic done)
- [ ] Modal mode
- [ ] Fullscreen mode
- [ ] Tabs mode
- [ ] Carousel mode
- [ ] Subview mode
- [ ] Grid layout improvements

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
├── universal-card.js    🔄 In Progress
├── core/
│   ├── UniversalCard.js      ⏳ Pending
│   ├── UniversalCardEditor.js ⏳ Pending
│   └── config.js             ⏳ Pending
├── modes/               ⏳ Pending
├── features/            ⏳ Pending
├── ui/                  ⏳ Pending
├── widgets/             ⏳ Pending
├── styles/              ⏳ Pending
├── editor/              ⏳ Pending
├── plugins/             ⏳ Pending
├── dev/                 ⏳ Pending
├── utils/               ⏳ Pending
└── i18n/                ⏳ Pending
```

---

## Notes

### 2024-01-15
- Project initialized
- Basic HACS structure created
- Git repository connected to GitHub
