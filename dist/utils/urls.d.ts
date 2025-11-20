/**
 * Checks if url contains the base page, we don't want external urls
 * @param url - The URL to check
 * @param page - The base page URL
 * @returns true if the url starts with the page
 */
export declare function urlContainsPage(url: string, page: string): boolean;
/**
 * Checks for anchors in URL
 * @param url - The URL to check
 * @returns true if the URL contains a hash anchor
 */
export declare function isUrlAnAnchor(url: string): boolean;
/**
 * Generates current date with yyyy-mm-dd format
 * @returns Current date in ISO format (YYYY-MM-DD)
 */
export declare function getDate(): string;
//# sourceMappingURL=urls.d.ts.map