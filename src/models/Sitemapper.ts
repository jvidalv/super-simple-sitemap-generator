import { chromium, Browser, Page } from 'playwright';
import { timeout } from '../utils/timeout';
import { urlContainsPage, isUrlAnAnchor, getDate } from '../utils/urls';
import * as builder from 'xmlbuilder';

export class Sitemapper {
  private baseUrls: string[];
  private urls: string[];
  private parsedUrls: string[];
  private wait: number;
  private page: Page | null = null;
  private browser: Browser | null = null;
  private errors: Error[] = [];
  private xml: string = '';
  private currentDate: string;

  /**
   * Creates a new Sitemapper instance
   * @param wait - Milliseconds to wait on each parse for content to load
   * @param _limit - Maximum number of URLs to parse (unused internally, managed by caller)
   * @param urls - Initial base URL(s) to start scraping from
   */
  constructor(wait: number, _limit: number, ...urls: string[]) {
    this.baseUrls = [urls[0]];
    this.urls = [urls[0]];
    this.parsedUrls = [];
    this.wait = wait;
    this.currentDate = getDate();
  }

  /**
   * Initializes the browser instance
   */
  async init(): Promise<void> {
    this.browser = await chromium.launch();
  }

  /**
   * Parses a URL and extracts all internal links
   * @param url - The URL to parse
   */
  async parse(url: string): Promise<void> {
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
      await timeout(this.wait);

      // Extract all links from the page
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extractedUrls = await this.page.evaluate(() => {
        // This code runs in the browser context where document is available
        // @ts-ignore - document is available in browser context
        const anchors: any[] = Array.from(document.querySelectorAll("a,link[rel='alternate']"));
        return anchors.map((anchor: any) => {
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
    } catch (error) {
      this.errors.push(error instanceof Error ? error : new Error(String(error)));
      console.error(`Error parsing ${url}:`, error);
    } finally {
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
  generateXml(): void {
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
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Removes a specific URL from the urls array
   * @param url - The URL to remove
   */
  private removeUrlFromUrls(url: string): void {
    const index = this.urls.findIndex((element) => element === url);
    if (index !== -1) {
      this.urls.splice(index, 1);
    }
  }

  /**
   * Removes already parsed URLs from the urls array
   */
  private removeParsedUrlsFromUrls(): void {
    this.urls = this.urls.filter((url) => !this.parsedUrls.includes(url));
  }

  /**
   * Removes duplicate URLs from the urls array
   */
  private removeRepeatedUrls(): void {
    this.urls = [...new Set(this.urls)];
  }

  /**
   * Filters URLs to keep only internal links without anchors
   */
  private filterUrls(): void {
    this.urls = this.urls.filter(
      (url) => urlContainsPage(url, this.baseUrls[0]) && !isUrlAnAnchor(url)
    );
  }

  /**
   * Gets the generated XML sitemap
   */
  getXml(): string {
    return this.xml;
  }

  /**
   * Gets all URLs remaining to be parsed
   */
  getUrls(): string[] {
    return this.urls;
  }

  /**
   * Gets all successfully parsed URLs
   */
  getParsedUrls(): string[] {
    return this.parsedUrls;
  }

  /**
   * Gets all errors encountered during parsing
   */
  getErrors(): Error[] {
    return this.errors;
  }
}
