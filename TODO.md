# TODO

## Phase 1: Project Setup ✅ DONE
- [x] Create Astro project
- [x] Set up directory structure
- [x] Create CLAUDE.md
- [x] Create TODO.md
- [x] Create .gitignore
- [x] Initialize git and GitHub repo

## Phase 2: Data & Types ✅ DONE
- [x] Add complete sample JSON to `/src/data/collection.json`
- [x] Create TypeScript types for sample data structure (sample.ts)
- [x] Create TypeScript types for transformed output (item.ts)

## Phase 3: Transformation Logic ✅ DONE (CORE)
- [x] Create analysis script showing data inconsistencies
- [x] Create transform function to normalize data
- [x] Handle inconsistent `creator` field (string | array | null)
- [x] Handle inconsistent `date` field (string | number | object | null)
- [x] Handle inconsistent `materials` field (string | array | null)
- [x] Handle inconsistent `dimensions` field (various structures)
- [x] Handle missing `title` fields (provide fallback)
- [x] Add clear comments explaining edge cases

## Phase 4: Display 🚧 IN PROGRESS
- [ ] Create simple display page (`/src/pages/index.astro`)
- [ ] Load JSON data
- [ ] Transform data using our functions
- [ ] Create card component for individual items
- [ ] Create grid layout component
- [ ] Add basic error handling
- [ ] Test that everything displays correctly

## Phase 5: Documentation
- [ ] Write README with setup instructions
- [ ] Document key design decisions
- [ ] Explain transformation approach
- [ ] List what would improve with more time
- [ ] Add note about time spent

## Phase 6: Polish
- [ ] Review all code for clarity
- [ ] Ensure comments are helpful
- [ ] Test that everything runs cleanly
- [ ] Final README review
- [ ] Check for any console errors

## Phase 7: Submission
- [ ] Final push to GitHub
- [ ] Verify repo is public
- [ ] Double-check README
- [ ] Test: Can someone clone and run it?
- [ ] Submit!

---

## Notes:
- Focus on clarity over completeness
- Don't over-engineer (no features not requested)
- The transform logic is the heart of this exercise
- Keep it simple and well-explained
