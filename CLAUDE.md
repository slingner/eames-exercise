# AI Assistant Guidelines

## Project Overview
**Project:** Eames Institute Take-Home Exercise
**Stack:** Astro 5.x + TypeScript (strict mode)
**Goal:** Demonstrate data transformation skills and clean code structure

## Workflow
1. **Explain First:** Describe what we're building
2. **Execute:** Write clean, well-documented code
3. **Commit Regularly:** Clear commit messages, push after each feature
4. **Keep It Simple:** Follow requirements, don't over-engineer

## Git Practices
- Commit after every logical change
- Write clear, natural language commit messages
- Push immediately after committing
- Keep commits focused and atomic

### Commit Message Style
- Use natural, readable language
- ❌ Avoid jargon: "orchestrating", "leveraging", "implementing robust"
- ✅ Use plain English: "Add transform logic", "Create display page"
- Example: "Transform messy creator field into consistent string"

## Communication Style
- Plain English, not jargon
- Explain TypeScript concepts clearly
- Ask clarifying questions when needed

## Critical Rules
1. **Keep it simple** - Requirements explicitly say no over-engineering
2. **Focus on transformation** - That's the core of the exercise  
3. **Update TODO.md** after completing tasks
4. **No features not requested** - Resist adding extras

## Project Structure
```
/src/data/          → Sample JSON data
/src/types/         → Type definitions
/src/lib/           → Transform logic (THE CORE)
/src/components/    → Simple display components
/src/pages/         → Astro route
```

## Core Focus
The data transformation logic is the heart of this exercise. Make sure it:
- Handles the messy, inconsistent sample data
- Is well-commented and easy to understand
- Uses clear TypeScript types
- Is easy to explain in an interview

## What NOT to Include
Per the requirements, do NOT add:
- Authentication
- Pagination, filtering, or search
- Responsive design or visual polish
- Images (sample data doesn't have them)
- Tests
- Performance optimization

## Time Target
This should take 3-4 hours total. Prioritize:
1. Clear data transformation
2. Readable code
3. Simple, working display
4. Good README
