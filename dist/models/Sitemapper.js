"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sitemapper = void 0;
const playwright_1 = require("playwright");
const timeout_1 = require("../utils/timeout");
const urls_1 = require("../utils/urls");
const builder = __importStar(require("xmlbuilder"));
class Sitemapper {
    baseUrls;
    urls;
    parsedUrls;
    wait;
    page = null;
    browser = null;
    errors = [];
    xml = '';
    currentDate;
    /**
     * Creates a new Sitemapper instance
     * @param wait - Milliseconds to wait on each parse for content to load
     * @param _limit - Maximum number of URLs to parse (unused internally, managed by caller)
     * @param urls - Initial base URL(s) to start scraping from
     */
    constructor(wait, _limit, ...urls) {
        this.baseUrls = [urls[0]];
        this.urls = [urls[0]];
        this.parsedUrls = [];
        this.wait = wait;
        this.currentDate = (0, urls_1.getDate)();
    }
    /**
     * Initializes the browser instance
     */
    async init() {
        this.browser = await playwright_1.chromium.launch();
    }
    /**
     * Parses a URL and extracts all internal links
     * @param url - The URL to parse
     */
    async parse(url) {
        if (!this.browser) {
            throw new Error('Browser not initialized. Call init() first.');
        }
        // Check if already parsed
        if (this.parsedUrls.includes(url)) {
            this.removeUrlFromUrls(url);
            return;
        }
        this.page = await this.browser.newPage();
        try {
            await this.page.goto(url, { waitUntil: 'networkidle' });
            await (0, timeout_1.timeout)(this.wait);
            // Extract all links from the page
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const extractedUrls = await this.page.evaluate(() => {
                // This code runs in the browser context where document is available
                // @ts-ignore - document is available in browser context
                const anchors = Array.from(document.querySelectorAll("a,link[rel='alternate']"));
                return anchors.map((anchor) => {
                    // Handle SVG elements with baseVal
                    if (anchor.href && typeof anchor.href === 'object' && anchor.href.baseVal) {
                        // @ts-ignore - document is available in browser context
                        const a = document.createElement("a");
                        a.href = anchor.href.baseVal;
                        return a.href;
                    }
                    return anchor.href;
                });
            });
            this.urls = [...extractedUrls, ...this.urls];
            this.removeRepeatedUrls();
            this.filterUrls();
            this.removeUrlFromUrls(url);
            this.parsedUrls.push(url);
            this.removeParsedUrlsFromUrls();
        }
        catch (error) {
            this.errors.push(error instanceof Error ? error : new Error(String(error)));
            console.error(`Error parsing ${url}:`, error);
        }
        finally {
            // Close the page to prevent memory leaks
            if (this.page) {
                await this.page.close();
                this.page = null;
            }
        }
    }
    /**
     * Generates the XML sitemap content
     */
    generateXml() {
        const tempXml = builder
            .create('urlset')
            .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        for (const url of this.parsedUrls) {
            tempXml
                .ele('url')
                .ele('loc', url).up()
                .ele('lastmod', this.currentDate).up();
        }
        this.xml = tempXml.end({ pretty: true });
    }
    /**
     * Closes the browser instance
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
    /**
     * Removes a specific URL from the urls array
     * @param url - The URL to remove
     */
    removeUrlFromUrls(url) {
        const index = this.urls.findIndex((element) => element === url);
        if (index !== -1) {
            this.urls.splice(index, 1);
        }
    }
    /**
     * Removes already parsed URLs from the urls array
     */
    removeParsedUrlsFromUrls() {
        this.urls = this.urls.filter((url) => !this.parsedUrls.includes(url));
    }
    /**
     * Removes duplicate URLs from the urls array
     */
    removeRepeatedUrls() {
        this.urls = [...new Set(this.urls)];
    }
    /**
     * Filters URLs to keep only internal links without anchors
     */
    filterUrls() {
        this.urls = this.urls.filter((url) => (0, urls_1.urlContainsPage)(url, this.baseUrls[0]) && !(0, urls_1.isUrlAnAnchor)(url));
    }
    /**
     * Gets the generated XML sitemap
     */
    getXml() {
        return this.xml;
    }
    /**
     * Gets all URLs remaining to be parsed
     */
    getUrls() {
        return this.urls;
    }
    /**
     * Gets all successfully parsed URLs
     */
    getParsedUrls() {
        return this.parsedUrls;
    }
    /**
     * Gets all errors encountered during parsing
     */
    getErrors() {
        return this.errors;
    }
}
exports.Sitemapper = Sitemapper;
//# sourceMappingURL=Sitemapper.js.map