import { Page, Locator, expect } from "@playwright/test";
import { logger } from "../utils/logger.js";
import { Product } from "../models/Product.js";
import { formatter } from "../utils/formatter.js";

export class SearchResultsPage {
  private readonly page: Page;
  private readonly colorFilterBlanco: Locator;
  private readonly sortDropdown: Locator;
  private readonly lowestPriceOption: Locator;
  private readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    // Filter color component
    this.colorFilterBlanco = page.locator("#variants-normalizedColor-Blanco");

    // Isolate the desktop lowest price option component
    this.sortDropdown = page.locator(".d-none.d-lg-block").locator("a#sortby");
    this.lowestPriceOption = page
      .locator(".d-none.d-lg-block")
      .locator('button[datahref="/tienda/sortPrice|0"]');

    // Product Cards div
    this.productCards = page.locator("li.m-product__card");
  }

  async filterByColorBlanco() {
    logger.debug("Filtering by color Blanco...");
    await this.colorFilterBlanco.click();
    // Wait for the results to update after filtering
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
  }

  async sortByLowestPrice() {
    logger.debug("Sorting by lowest price...");
    // Click the desktop dropdown trigger
    await this.sortDropdown.click();

    // Isolate the desktop dropdown menu container
    const dropdownMenu = this.page
      .locator(".d-none.d-lg-block")
      .locator(".dropdown-menu.show");

    // Assert the menu opens
    await expect(dropdownMenu).toBeVisible({
      timeout: 5000,
    });

    // Assert the option exists
    await expect(this.lowestPriceOption).toBeVisible({
      timeout: 2000,
    });

    // Click the option
    await this.lowestPriceOption.click();

    // Wait for the network to fetch the newly sorted products
    //await this.page.waitForLoadState("load");
    //await this.page.waitForTimeout(2000);
  }

  async getTop5ResultsFromUI(): Promise<Product[]> {
    logger.debug("Extracting top 5 results from UI...");
    const results: Product[] = [];

    //  Wait UI to render, if the 5th item is visible, we have at least 5 items and continue.
    await this.productCards
      .nth(4)
      .waitFor({ state: "visible", timeout: 15000 });

    //Loop through the cards, helper method to find the cards and the mapper to Product Schema
    for (let i = 0; i < 5; i++) {
      const product = await this.extractSingleCardToProduct(
        this.productCards.nth(i),
      );
      results.push(product);
    }
    return results;
  }

  private async extractSingleCardToProduct(card: Locator): Promise<Product> {
    // Raw text retrieval
    const rawBrand = await card.locator("h3.a-card-brand").innerText();
    const rawName = await card
      .locator("h3.card-title.a-card-description")
      .innerText();
    const regularPriceLocator = await card.locator("p.a-card-price");

    const rawRegularPrice = (await regularPriceLocator.isVisible())
      ? await regularPriceLocator.innerText()
      : "0";

    const priceDiscountLocator = card.locator("p.a-card-discount");

    // Check if discountPrice exists; otherwise assign 0
    const rawDiscountPrice = (await priceDiscountLocator.isVisible())
      ? await priceDiscountLocator.innerText()
      : "0";

    // Process the data and parsing it
    const price = formatter.parsePrice(rawRegularPrice);
    const discounted =
      rawDiscountPrice !== "0" ? formatter.parsePrice(rawDiscountPrice) : price;

    // Return normalized text into Product entity
    return {
      brand: formatter.normalizeText(rawBrand),
      name: formatter.normalizeText(rawName),
      price: price,
      discounted: discounted,
    };
  }
}
