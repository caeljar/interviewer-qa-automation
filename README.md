# Liverpool E-commerce QA Automation

Technical assessment for a QA Automation position. This framework automates the search, filter, and validation flow on `liverpool.com.mx` using Playwright and TypeScript.

## Features

- **Page Object Model (POM):** Clean and maintainable design.
- **Cross-Validation:** UI results are validated against the **intercepted** backend JSON response.
- **Accessibility Testing:** Integrated `@axe-core/playwright` for automated A11y scans.
- **Logging:** Structured logging using `pino`.
- **CI/CD:** GitHub Actions workflow for automated execution.

## 🛠 Installation for Local Execution

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install --with-deps
   ```

## 🚀 Running Tests

### Headless Mode (Default)

Recommended for CI and fast local execution.

```bash
npx playwright test
```

### Headed Mode

Useful for debugging and seeing the automation in action.

```bash
HEADLESS=false npx playwright test
```

### UI Mode

Interactive test runner with time-travel debugging.

```bash
npx playwright test --ui
```

## 📊 Reports

After running the tests, an HTML report is generated automatically. To view it:

```bash
npx playwright show-report
```

## 📂 Project Structure

- `tests/`: Test specifications (Data-driven approach).
- `pages/`: Page Object Models (Encapsulated logic).
- `models/`: TypeScript interfaces (Product schemas).
- `utils/`: Helper functions (Formatter, Logger).
- `data/`: Test data (JSON search terms).
- `.github/workflows/`: CI/CD configuration (GitHub Actions).

## 📋 Data-Driven JSON

To add, modify, or extend test scenarios without changing the execution code, update the external JSON parameter file located at data/liverpool-search-data.json.

## 📝 Strategy & Decisions

For detailed information about the test strategy, CAPTCHA handling, and mitigation of flakiness, refer to [TEST_STRATEGY.md](./TEST_STRATEGY.md).
