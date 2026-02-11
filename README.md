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

### Optional: View Data Analysis

To see a detailed analysis of the data inconsistencies that the transform handles:

```bash
npm run analyze
```

## Project Structure

```
/src
  /data          → Sample collection data (JSON)
  /types         → TypeScript type definitions
  /lib           → Data transformation logic (the core)
  /components    → Simple display components
  /pages         → Astro routes
  /scripts       → Data analysis utilities
  /styles        → Design tokens and global styles
```

## Key Design Decisions

### Data Transformation Approach

The heart of this exercise is in `/src/lib/transform.ts`. The `transformRecord()` function handles multiple types of inconsistencies in the sample data:

**Creator Field** - Can be a string, array, or null
- Joins arrays with " and " (e.g., `["Charles Eames", "Ray Eames"]` → `"Charles Eames and Ray Eames"`)
- Filters out "Unknown" values
- Returns null for missing/empty data

**Date Field** - Can be a string, number, object with display field, or null
- Extracts display value from objects
- Converts numbers to strings
- Treats "unknown" as null
- Handles missing data gracefully

**Materials Field** - Can be a string, array, or null
- Joins arrays with ", " for readability
- Returns null for empty/missing data

**Dimensions Field** - Highly variable structure
- Prefers `display` field when available
- Falls back to building from h/w/d/l/diameter values
- Filters out "?" placeholders
- Formats as `H x W x D` with units

**Flags Field** - Converts snake_case to camelCase
- Maps fields like `possible_duplicate` → `possibleDuplicate`
- Filters out non-boolean values
- Returns null if no flags are set

**Related Items** - Enriches with titles
- The `enrichRelatedItems()` function looks up related object titles
- Creates a more useful display for relationships

### TypeScript Structure

Two distinct type definitions:

- `SampleRecord` (`/src/types/sample.ts`) - Mirrors the messy, real-world API data
- `Item` (`/src/types/item.ts`) - Clean, normalized structure for the UI

This separation makes it clear what we're transforming _from_ and _to_, which is important for understanding the data pipeline.

### Display Strategy

Simple card-based grid using CSS Grid. Each card shows:
- Core metadata (title, creator, date, materials, dimensions)
- Additional information accessible via a modal

Used native HTML `<dialog>` element for the modal to avoid adding dependencies.

### Design Tokens

Created a minimal design tokens system in `/src/styles/tokens.css` to demonstrate code organization without over-engineering. Defines colors, spacing, and typography using CSS custom properties.

## What I Would Improve With More Time

### Data Layer
- Add validation for transformed data (ensure no undefined values slip through)
- Handle edge cases like HTML entities in text fields
- Add unit tests for the transform function to verify all edge cases
- Better error handling for malformed data

### Display
- Add loading states and skeleton screens
- Improve accessibility (keyboard navigation, focus management, screen reader support)
- Add proper image handling if images were available in the data
- Better mobile experience (though responsive design wasn't required)

### Developer Experience
- Add more comprehensive TypeScript coverage for the additional metadata fields
- Create better error boundaries with helpful error messages
- Add JSDoc comments to all public functions
- Set up linting and formatting (Prettier, ESLint)

### Performance
- Implement virtual scrolling for very large collections
- Add pagination or infinite scroll
- Consider memoization for expensive operations

## Time Spent

Approximately 3.5 hours total:
- Data analysis and type definitions: ~1 hour
- Transform logic and edge case handling: ~1.5 hours
- Display components and styling: ~1 hour

## Tech Stack

- **Astro 5.x** - Static site generator
- **TypeScript** - Type safety and developer experience
- **CSS** - Native styling with design tokens
