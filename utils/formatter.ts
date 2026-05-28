/**
 * Strips special characters, parses to float, and adjusts for superscript decimals.
 */
function parsePrice(price: string): number {
  if (!price || price === "0") return 0;
  return parseFloat(price.replace(/[^\d]/g, "")) / 100;
}

/**
 * Removes whitespace and converts to lowercase.
 */
function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export const formatter = {
  parsePrice: parsePrice,
  normalizeText: normalizeText,
};
