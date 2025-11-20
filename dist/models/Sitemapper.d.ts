export declare class Sitemapper {
    private baseUrls;
    private urls;
    private parsedUrls;
    private wait;
    private page;
    private browser;
    private errors;
    private xml;
    private currentDate;
    /**
     * Creates a new Sitemapper instance
     * @param wait - Milliseconds to wait on each parse for content to load
     * @param _limit - Maximum number of URLs to parse (unused internally, managed by caller)
     * @param urls - Initial base URL(s) to start scraping from
     */
    constructor(wait: number, _limit: number, ...urls: string[]);
    /**
     * Initializes the browser instance
     */
    init(): Promise<void>;
    /**
     * Parses a URL and extracts all internal links
     * @param url - The URL to parse
     */
    parse(url: string): Promise<void>;
    /**
     * Generates the XML sitemap content
     */
    generateXml(): void;
    /**
     * Closes the browser instance
     */
    close(): Promise<void>;
    /**
     * Removes a specific URL from the urls array
     * @param url - The URL to remove
     */
    private removeUrlFromUrls;
    /**
     * Removes already parsed URLs from the urls array
     */
    private removeParsedUrlsFromUrls;
    /**
     * Removes duplicate URLs from the urls array
     */
    private removeRepeatedUrls;
    /**
     * Filters URLs to keep only internal links without anchors
     */
    private filterUrls;
    /**
     * Gets the generated XML sitemap
     */
    getXml(): string;
    /**
     * Gets all URLs remaining to be parsed
     */
    getUrls(): string[];
    /**
     * Gets all successfully parsed URLs
     */
    getParsedUrls(): string[];
    /**
     * Gets all errors encountered during parsing
     */
    getErrors(): Error[];
}
//# sourceMappingURL=Sitemapper.d.ts.map