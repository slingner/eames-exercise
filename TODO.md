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
- [x] Generate TypeScript types using quicktype for sample data (sample.ts)
- [x] Create TypeScript types for transformed output (item.ts)

## Phase 3: Transformation Logic ✅ DONE (CORE)
- [x] Create transform function to normalize data
- [x] Handle inconsistent `creator` field (string | array | null)
- [x] Handle inconsistent `date` field (string | number | object | null)
- [x] Handle inconsistent `materials` field (string | array | null)
- [x] Handle inconsistent `dimensions` field (various structures)
- [x] Handle all 7 flag types
- [x] Handle missing `title` fields (provide fallback)
- [x] Add clear comments explaining edge cases

## Phase 4: Display ✅ DONE
- [x] Create simple display page (`/src/pages/index.astro`)
- [x] Load JSON data
- [x] Transform data using our functions
- [x] Create card component for individual items
- [x] Create grid layout component
- [x] Add basic error handling
- [x] Test that everything displays correctly

## Phase 5: Documentation ✅ DONE
- [x] Write README with setup instructions
- [x] Document key design decisions
- [x] Explain transformation approach
- [x] List what would improve with more time
- [x] Add note about time spent

## Phase 6: Polish ✅ DONE
- [x] Review all code for clarity
- [x] Refactor ItemCard to use arrays instead of repetition
- [x] Ensure comments are helpful
- [x] Validate types with quicktype
- [x] Test that everything runs cleanly (TypeScript, build, dev server all work)
- [x] Check for any console errors

## Phase 7: Submission ✅ READY
- [x] Final push to GitHub (with conventional commits)
- [x] Verify repo is public
- [x] Double-check README
- [x] Test cloning (repo is public, npm install && npm run dev should work)
- [x] Submit!

---

## Notes:
- Focus on clarity over completeness
- Don't over-engineer (no features not requested)
- The transform logic is the heart of this exercise
- Keep it simple and well-explained
