# Liverpool QA Automation Assessment

This repository contains a production-grade Playwright automation framework designed to validate the search, filter, and sort flow on `liverpool.com.mx`.

## Features
- **Page Object Model (POM)** for clean, maintainable code.
- **Service Interception** to validate UI data against backend API responses.
- **Accessibility Testing** using `@axe-core/playwright`.
- **GitHub Actions Integration** for automated CI/CD.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (installed with Node.js)

### Installation
1. Clone the repository.
2. Install dependencies and Playwright browsers:
   ```bash
   npm install
   npx playwright install chromium --with-deps
   ```

### Running Tests

#### Headless Mode (Standard)
```bash
npx playwright test
```

#### Headed Mode (Visual execution)
```bash
npx playwright test --headed
```

#### View HTML Report
After running the tests, you can view the detailed HTML report:
```bash
npx playwright show-report
```

## Project Structure
- `pages/`: Page Object Models for navigation and interaction.
- `tests/`: Test specifications and data-driven scenarios.
- `.github/workflows/`: CI configuration for GitHub Actions.
- `TEST_STRATEGY.md`: Architectural decisions and risk mitigation.
