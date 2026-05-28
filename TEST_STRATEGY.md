# Test Strategy - Liverpool E-commerce Automation

## 1. What would you not automate in this flow, and why?

I would explicitly avoid automating exact static data assertions. E-commerce data in production environment is highly volatile owing to prices and inventory changing daily. As I did in the codification; I would prepare a cross-validation against what the JSON request the client is recieving and what is being rendered on the front-end. Furthermore, I would not automate interactions with ads or third-party integrations; I would not be able to anticipate its behaviour.

## 2. If Liverpool added a CAPTCHA to the search flow, how would you handle it?

I would not attempt to automate solving the CAPTCHA; not even with Visual Computation. CAPTCHAs are designed to block RPAs; trying to bypass them via UI automation is an anti-pattern and a programming challenge that could lead to high maintenance of the script and a continue rewriting of the codification.
Instead, I would collaborate with the Security team to implement an environmental bypass:

- **IP Whitelisting (ACL)**: Whitelist the static IP addresses of our CI/CD agents servers.
- **Header/Cookie Injection**: Configure a **staging** environment to bypass the CAPTCHA if the test injects a specific secret HTTP header or secure cookie.
- **Pre-Production Environments**: Disable CAPTCHA entirely in the QA/Staging environments where all E2E execution should take place.

## 3. What flakiness risks exist in this test, and how did you mitigate them?

- **Network Latency:** Liverpool's search API is slow; it compels some components to have race conditions. I mitigated this by using `page.waitForResponse` method instead of fixed timeout when it is necessary.
- **Dynamic Selectors:** E-commerce sites often change class names. I used selectors and test-selectos whenever it was possible (IDs like `blt26617d4f2e17657d-header-search-input`).
- **Race Conditions:** UI results might render before the API response is fully parsed. I ensured the test waits for the Promises to resolve before proceeding to UI extraction.

## 4. If you had to add this to a team's CI pipeline with 50+ suites, what would you change?

- **Test Sharding and Parallelism:** I would look to configure Playwright to run across multiple runners simultaneously.
- **Fail-Fast Strategy**: I would configure maxFailures in playwright.config.ts so the pipeline aborts early if critical failures occur, saving compute resources.
- **Visual Regression Testing**: I would configure screenshot comparisons to catch unexpected CSS or layout regressions on the grid and decide if it's necessary to execute the whole workflow or not (Only if permitted and the logic hasn't changed.).
