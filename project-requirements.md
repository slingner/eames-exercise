# Technical Exercise Overview & Guidelines

<aside>
💡

This document pertains to applicants for the [Full-Stack Engineer role](https://job-boards.greenhouse.io/eamesinstitute/jobs/5735782004) at the Eames Institute.

</aside>

## Context

At the [Eames Institute](https://www.eamesinstitute.org/), much of our engineering work involves integrating data from external systems (collections databases, CRMs, etc.), normalizing it, and making it usable in content-driven web experiences.

This exercise is designed to reflect that kind of work in a simplified form.

We are not evaluating polish or feature completeness — we are evaluating how you structure code, handle data, and communicate decisions.

### Your Task

Build a small app or script that:

1. **Loads data from an external source**
    - Use a public API of your choice
    - Or use the following JSON file as if it were an API response
        
        [Sample JSON dataset](https://www.notion.so/Sample-JSON-dataset-2f55696cd2d581408c63c71611a72dc7?pvs=21)
        
2. **Normalizes / transforms the data**
    - Map it into a cleaner internal structure
    - Handle missing or inconsistent fields
3. **Displays the result in a simple frontend**
    - List or grid layout is fine+
    - Include basic loading and error handling
4. **Includes brief documentation**
    - How to run the project
    - Key design decisions and tradeoffs
    - What you would improve with more time

### Technical Expectations

- TypeScript is strongly preferred
- Any framework or minimal setup is fine (Astro, Next.js, Vite, etc.)
- Focus on clarity and maintainability over UI polish
- AI tools are permitted, but you should be able to fully explain and justify all code and design choices

### What Is Explicitly NOT Required

Please do **not** spend time on:

- Authentication
- Pagination, filtering, or search
- Responsive design or visual polish (images not required!)
- Unit or integration tests
- Performance optimization

These are all topics we’re happy to discuss in the interview—or anything else you’d do with more time—but we do not expect or want them implemented here.

We are not evaluating production readiness. In other words: this is not meant to be a portfolio piece!

### Time Expectation

We expect this to take approximately **3–4 hours**.

Please do not spend more time than that — we are intentionally not looking for completeness. We don’t want to see *what* you can create, we want to see *how* you work.

If you run out of time, prioritize:

1. Clear data transformation
2. Readable code
3. Explaining in the README what you would do next

### Submission

Please provide:

- A link to a GitHub repository (or zip file)
- A short README with:
    - Setup instructions
    - Design decisions and tradeoffs
    - What you would improve with more time

### Use of the Exercise

We’ll use your submission to inform our follow-up interview, where we’ll walk through your approach, tradeoffs, and what you’d do with more time.

Your submission will be used only for evaluating your candidacy and will not be used in any product, research, training, or operational work.