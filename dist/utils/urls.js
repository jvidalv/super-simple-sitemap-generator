"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlContainsPage = urlContainsPage;
exports.isUrlAnAnchor = isUrlAnAnchor;
exports.getDate = getDate;
/**
 * Checks if url contains the base page, we don't want external urls
 * @param url - The URL to check
 * @param page - The base page URL
 * @returns true if the url starts with the page
 */
function urlContainsPage(url, page) {
    return url.startsWith(page);
}
/**
 * Checks for anchors in URL
 * @param url - The URL to check
 * @returns true if the URL contains a hash anchor
 */
function isUrlAnAnchor(url) {
    return url.includes('#');
}
/**
 * Generates current date with yyyy-mm-dd format
 * @returns Current date in ISO format (YYYY-MM-DD)
 */
function getDate() {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
}
//# sourceMappingURL=urls.js.map