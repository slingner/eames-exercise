# Eames Institute Take-Home Exercise

A simple data transformation and display application built with Astro and TypeScript.

## Setup Instructions

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:4321`

## Project Structure

```
/src
  /components    → Simple display components
  /data          → Sample collection data (JSON)
  /lib           → Data transformation logic (the core)
  /pages         → Astro routes
  /scripts       → quicktype-generated types for reference
  /styles        → Design tokens and global styles
  /types         → TypeScript type definitions
```

## Key Design Decisions

**Data Transformation** - The core logic in `/src/lib/transform.ts` normalizes inconsistent data:
- Handles multiple inconsistent formats for creator, date, materials, and dimensions fields
- Normalizes many different dimension structures into readable strings
- Converts snake_case flags to camelCase
- Provides fallbacks for missing data

**TypeScript Types** - Two distinct type sets:
- Raw types - Generated with [quicktype](https://quicktype.io/) from JSON for accuracy
  - Regenerate: `npx quicktype src/data/collection.json -o src/scripts/quicktype-generated.ts`
- `Item` - Manually designed clean output structure
- This separation clarifies the transformation pipeline

**Display** - Simple card grid with native `<dialog>` modals for additional info

**Styling** - CSS custom properties for design tokens (colors, spacing, typography)

## What I Would Improve With More Time

**Testing** - Add unit tests for the transform functions to verify edge case handling

**Runtime Validation** - Use Zod or similar to validate data at runtime, not just at compile time

**Error Handling** - Add error boundaries and better error states for malformed data

**Accessibility** - Improve keyboard navigation and add proper ARIA labels for screen readers

**Loading States** - Add skeleton screens while data loads

---

**Structured dates** — Preserve display string alongside earliest/latest values as a date object, enabling range queries without losing curator intent

**Creator as arrays** — Normalize creators to arrays for individual filterability, handle display formatting at the presentation layer

**Non-destructive transforms** — Store raw ingested data before transforming so original data is always available for re-processing

**Stakeholder input** — Understand how the data will be used before making normalization decisions (search, filtering, aggregation needs)

**Reusable modal component** — Extract the modal from ItemCard into its own component for reuse across the app

## Time Spent

Approximately 3.5 hours total:
- Data analysis and type definitions: ~1 hour
- Transform logic and edge case handling: ~1.5 hours
- Display components and styling: ~1 hour

## Tech Stack

- **Astro 5.x** - Static site generator
- **TypeScript** - Type safety and developer experience
- **CSS** - Native styling with design tokens

## Development Tools

**Claude AI** was used as a development assistant for:
- Writing scripts to analyze the JSON data structure
- Developing and refining the transformation functions
- Code review and feedback on implementation approaches
- Discussing edge cases and design decisions

All code was reviewed, understood, and modified by me. The final implementation represents my understanding and decision-making.
