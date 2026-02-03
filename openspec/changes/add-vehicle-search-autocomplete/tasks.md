## 1. Web Frontend - Searchable Components

- [ ] 1.1 Create `SearchableSelect` component in `components/ui/`
  - Input field with search icon
  - Dropdown with filtered options
  - Keyboard navigation support (arrow keys, enter, escape)
  - Clear button to reset selection

- [ ] 1.2 Update brand selection in `create/vehicle/page.tsx`
  - Replace static list with SearchableSelect
  - Filter brands by typed text (case-insensitive)
  - Show matching results as user types

- [ ] 1.3 Update model selection in `create/vehicle/page.tsx`
  - Replace static list with SearchableSelect for model base names
  - Filter grouped models by typed text
  - Show number of versions per model

- [ ] 1.4 Update version selection in `create/vehicle/page.tsx`
  - Add filter input above version checkboxes
  - Filter versions by typed text
  - Maintain multi-select behavior

## 2. Mobile Frontend - Searchable Components

- [ ] 2.1 Create searchable select component for React Native
- [ ] 2.2 Update brand selection in mobile vehicle screen
- [ ] 2.3 Update model selection in mobile vehicle screen
- [ ] 2.4 Update version selection in mobile vehicle screen

## 3. Testing & Polish

- [ ] 3.1 Test search with special characters and accents
- [ ] 3.2 Test keyboard navigation
- [ ] 3.3 Test empty state when no results match
- [ ] 3.4 Ensure accessibility (ARIA labels, focus management)
