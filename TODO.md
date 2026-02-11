# TODO

## Phase 1: Project Setup ✅
- [x] Create Astro project
- [x] Set up directory structure
- [x] Create CLAUDE.md
- [x] Create TODO.md
- [x] Create .gitignore

## Phase 2: Data & Types
- [ ] Add complete sample JSON to `/src/data/collection.json`
- [ ] Create TypeScript types for sample data structure
- [ ] Create TypeScript types for transformed output

## Phase 3: Transformation Logic (CORE)
- [ ] Create transform function to normalize data
- [ ] Handle inconsistent `creator` field (string | array | null)
- [ ] Handle inconsistent `date` field (string | number | object | null)
- [ ] Handle inconsistent `materials` field (string | array | null)
- [ ] Handle inconsistent `dimensions` field (various structures)
- [ ] Handle missing `title` fields (provide fallback)
- [ ] Add clear comments explaining edge cases

## Phase 4: Display
- [ ] Create simple display page (`/src/pages/index.astro`)
- [ ] Create card component for individual items
- [ ] Create grid layout component
- [ ] Add basic loading state
- [ ] Add basic error handling

## Phase 5: Documentation
- [ ] Write README with setup instructions
- [ ] Document key design decisions
- [ ] Explain transformation approach
- [ ] List what would improve with more time

## Phase 6: Polish
- [ ] Review all code for clarity
- [ ] Ensure comments are helpful
- [ ] Test that everything runs cleanly
- [ ] Final README review

## Phase 7: Submission
- [ ] Push to GitHub
- [ ] Verify repo is public
- [ ] Double-check README
- [ ] Submit!
