import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage.js";
import { SearchResultsPage } from "../pages/SearchResultsPage.js";
import AxeBuilder from "@axe-core/playwright";
import { logger } from "../utils/logger.js";
import { Product } from "../models/Product.js";
import { formatter } from "../utils/formatter.js";
import searchData from "../data/liverpool-search-data.json" with { type: "json" };

for (const { term, expectedMatches } of searchData) {
  test(`Search, filter, validate and run a11y scan for: ${term}`, async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    let apiResults: Product[] = [];
    let resultsUi: Product[] = [];

    // ========================================================
    // 1: Navigation & Search
    // ========================================================
    await test.step(`Maps and search for "${term}"`, async () => {
      await homePage.navigate();
      await homePage.searchFor(term);
    });

    // ========================================================
    // 2: Filter, Sort & Intercept API
    // ========================================================
    await test.step("Filter by color, sort by price, and intercept API", async () => {
      await searchResultsPage.filterByColorBlanco();

      // Generate a PromiseAll to force the retrieval of all info. without waiting time
      const [response] = await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes("getPlpFilter") &&
            res.url().includes("sortPrice") &&
            res.ok(),
        ),
        searchResultsPage.sortByLowestPrice(),
      ]);

      const json = await response.json();
      const apiRecords = json.mainContent.records;

      // Parse the JSON into Product entity
      apiResults = apiRecords.map((record: any) => {
        const rawBrand = record.allMeta.brand;
        const rawName = record._t;
        let frontendRenderedName = rawName;
        // Regex to delete the brand from the frontend. The logic in front-end removes the brand from the description.
        /*
        const brandRegex = new RegExp(rawBrand, "gi");
        frontendRenderedName = rawName
          .replace(brandRegex, "")
          .replace(/\s+/g, " ")
          .trim();
          */
        const prices = record.allMeta.variants[0].prices;
        return {
          brand: formatter.normalizeText(rawBrand),
          name: formatter.normalizeText(frontendRenderedName),
          price: parseFloat(prices.listPrice || prices.salePrice),
          discounted: parseFloat(prices.salePrice || prices.listPrice),
        };
      });
    });

    // ========================================================
    // STEP 3: UI Extraction & Cross-Validation
    // ========================================================
    await test.step("Extract UI cards and cross-validate with API data", async () => {
      resultsUi = await searchResultsPage.getTop5ResultsFromUI();
      let matches = 0;

      resultsUi.forEach((uiItem) => {
        const match = apiResults.find(
          (apiItem) =>
            apiItem.brand === uiItem.brand &&
            apiItem.name.includes(uiItem.name),
        );

        if (match) {
          const isRegularPriceMatch =
            uiItem.price.toFixed(2) === match.price.toFixed(2);
          const isDiscountPriceMatch =
            uiItem.discounted?.toFixed(2) === match.discounted?.toFixed(2);

          if (isRegularPriceMatch && isDiscountPriceMatch) {
            matches++;
          } else {
            logger.warn(
              `🚨\t${term}: Price mismatch for "${uiItem.name}": UI=$${uiItem.price} | API=$${match.price}`,
            );
          }
        } else {
          logger.warn(
            `⚠️\t${term}: Discrepancy: Item "${uiItem.name}" from UI not found in API.`,
          );
        }
      });

      logger.info(`Validation matches: ${matches}/5`);
      expect(matches).toBeGreaterThanOrEqual(expectedMatches);
    });

    // ========================================================
    // STEP 4: Accessibility Scan
    // ========================================================
    await test.step("Run Axe-core Accessibility Scan", async () => {
      test.setTimeout(test.info().timeout + 30000);
      logger.debug("Running accessibility scan...");
      const accessibilityResults = await new AxeBuilder({ page })
        .disableRules([
          "aria-required-children",
          "aria-valid-attr-value",
          "button-name",
          "label",
        ])
        .analyze();

      if (accessibilityResults.violations.length > 0) {
        logger.warn(
          `Accessibility violations found: ${accessibilityResults.violations.length}`,
        );
      }

      const criticalViolations = accessibilityResults.violations.filter(
        (v) => v.impact === "critical",
      );
      expect(criticalViolations).toEqual([]);
    });
  });
}
