Act as a Staff QA Automation Engineer. I have a technical assessment to complete. I need you to generate a complete, production-grade testing framework that automates an e-commerce flow on `liverpool.com.mx`.

Evaluation Criteria to Optimize For:

- Test strategy & critical thinking (55% of the grade)
- Clean framework design (Page Object Model, no hardcoded values)
- Resilience (zero flakiness, network-level waits)
- Multi-layer validation (UI vs. Network)

Tech Stack: TypeScript + Playwright test.

Please generate the code and content for the following 6 files. Output the complete code for each file, ready to be copied and pasted.

### 1. `playwright.config.ts` (Reporting & CI)

- Configure headless execution by default, but allow headed mode via standard CLI flags.
- Configure `fullyParallel: true` across workers.
- Set up the built-in HTML reporter.
- Configure automatic screenshots strictly on test failure.

### 2. `pages/HomePage.ts` & `pages/SearchResultsPage.ts` (Framework Design)

- Implement a clean Page Object Model.
- Create methods to: navigate to the home page, enter a search term, filter by color "Blanco" (White), sort by "Menor precio" (lowest to highest price).
- Create a method to extract the name and price of the first 5 product results from the UI.

### 3. `tests/liverpool-search.spec.ts` (Part 1, Part 2 & Bonus)

- Implement a data-driven test approach using an array of search terms (e.g., ["playstation 5"]).
- UI Automation: Execute the search, filter, and sort flow using the POM. Extract the top 5 results and print them to the console.
- Service Interception (CRITICAL): Use `page.waitForResponse` or `page.route` to intercept the backend search API call that Liverpool uses to populate the search results. Parse the JSON response.
- Cross-Validation: Compare the names and prices extracted from the UI against the data parsed from the intercepted JSON API response. Assert that at least 3 of the 5 UI results perfectly match the backend response data. Log any discrepancies.
- Accessibility Bonus: Include a quick `@axe-core/playwright` scan on the results page and assert there are no critical violations.

### 4. `.github/workflows/playwright.yml` (Part 3)

- Create a GitHub Actions workflow that triggers on push/pull_request.
- It must install dependencies, install Playwright browsers, run the tests headlessly, and upload the `playwright-report/` folder as a CI artifact.

### 5. `README.md`

- Provide clear, concise instructions for a new developer on how to: `npm install`, run tests in headless mode, run tests in headed mode, and view the HTML report.
