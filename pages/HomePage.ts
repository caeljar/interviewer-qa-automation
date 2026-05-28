import { Page, Locator } from "@playwright/test";
import { logger } from "../utils/logger.js";

export class HomePage {
  private readonly page: Page;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page
      .getByTestId("blt26617d4f2e17657d-header-search-input")
      .first();
  }

  async navigate() {
    logger.debug("Navigating to the home page...");
    await this.page.goto("/");
  }

  async searchFor(term: string) {
    logger.debug(`Searching for term: "${term}"...`);
    await this.searchInput.fill(term);
    await this.searchInput.press("Enter");
  }
}

//<input aria-invalid="false" aria-label="Buscar por producto, categoría y más..." autocomplete="off" class="placeholder:text-label-xs placeholder:md:text-label-sm text-label-xs md:text-label-sm px-2 md:px-4 py-2 h-full w-full rounded-lg text-base   placeholder:text-middle-emphasis placeholder:leading-4 focus:outline-none text-carbon-500 placeholder:text-carbon-500 pl-10 md:pl-11 bg-white at-text-input" data-testid="blt26617d4f2e17657d-header-search-input" id=":Rctd9d9utsq:-input" placeholder="Buscar por producto, categoría y más..." type="text" value="">
