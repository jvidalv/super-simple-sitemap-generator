/**
 * Checks if url contains the base page, we don't want external urls
 * @param url - The URL to check
 * @param page - The base page URL
 * @returns true if the url starts with the page
 */
export function urlContainsPage(url: string, page: string): boolean {
  return url.startsWith(page);
}

/**
 * Checks for anchors in URL
 * @param url - The URL to check
 * @returns true if the URL contains a hash anchor
 */
export function isUrlAnAnchor(url: string): boolean {
  return url.includes('#');
}

/**
 * Generates current date with yyyy-mm-dd format
 * @returns Current date in ISO format (YYYY-MM-DD)
 */
export function getDate(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  return [year, month, day].join('-');
}
