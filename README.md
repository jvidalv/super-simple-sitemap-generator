<p align="center">
  <img src="https://github.com/jvidalv/node-simple-sitemap-generator/blob/master/assets/logo.png?raw=true" />
</p>

[![License](http://img.shields.io/npm/l/super-simple-sitemap-generator.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![NPM Version](http://img.shields.io/npm/v/super-simple-sitemap-generator.svg?style=flat-square)](https://npmjs.com/package/super-simple-sitemap-generator)
[![NPM Downloads](https://img.shields.io/npm/dm/super-simple-sitemap-generator.svg?style=flat-square)](https://npmjs.com/package/super-simple-sitemap-generator)

# Super Simple Sitemap Generator

A Node.js powered scraper that crawls websites and generates sitemap.xml files. Works seamlessly with client-side rendered (CSR) applications like React, Angular, and Vue.

Built with TypeScript and Playwright for modern web scraping.

## Features

- Works with dynamic CSR applications (React, Angular, Vue, etc.)
- Built with TypeScript for type safety
- Powered by Playwright for reliable browser automation
- Configurable wait times for dynamic content
- Customizable URL limits
- Custom output paths
- Comprehensive test coverage
- Memory-efficient with proper resource cleanup

## Installation

Install globally:

```bash
npm install -g super-simple-sitemap-generator
```

Or use with npx (no installation required):

```bash
npx super-simple-sitemap-generator https://example.com
```

## CLI Usage

Basic usage:

```bash
sitemap https://example.com
```

With options:

```bash
sitemap --wait 2500 --limit 100 --output my-sitemap.xml https://example.com
```

### CLI Options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `<url>` | string | **required** | The base URL to start crawling from |
| `-w, --wait <ms>` | number | 1500 | Time in milliseconds to wait for dynamic content to load |
| `-l, --limit <n>` | number | 99999 | Maximum number of URLs to crawl |
| `-o, --output <path>` | string | sitemap.xml | Output file path for the generated sitemap |

## Programmatic Usage

You can also use this package as a library in your Node.js/TypeScript projects:

```typescript
import { Sitemapper } from 'super-simple-sitemap-generator';
import * as fs from 'fs';

async function generateSitemap() {
  const mapper = new Sitemapper(1500, 100, 'https://example.com');

  try {
    // Initialize the browser
    await mapper.init();

    // Parse the base URL
    await mapper.parse('https://example.com');

    // Parse all discovered URLs
    while (mapper.getUrls().length > 0 && mapper.getParsedUrls().length < 100) {
      const nextUrl = mapper.getUrls()[0];
      await mapper.parse(nextUrl);
    }

    // Generate the XML
    mapper.generateXml();

    // Write to file
    fs.writeFileSync('sitemap.xml', mapper.getXml());

    console.log(`Sitemap generated with ${mapper.getParsedUrls().length} URLs`);

    // Cleanup
    await mapper.close();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    await mapper.close();
  }
}

generateSitemap();
```

## Requirements

- Node.js >= 18.0.0

## What's New in v2.0

- **TypeScript rewrite** - Full type safety and better developer experience
- **Playwright instead of Puppeteer** - More reliable and modern browser automation
- **Better error handling** - Graceful error recovery and detailed error reporting
- **Memory leak fixes** - Proper cleanup of browser resources
- **Improved CLI** - Better progress indication and error messages
- **Custom output paths** - Specify where to save the sitemap
- **Bug fixes** - Fixed URL matching for short domains
- **Comprehensive tests** - Full test coverage with Vitest

## Breaking Changes from v1.x

- **Node.js requirement**: Now requires Node.js >= 18 (previously >= 10)
- **Browser engine**: Uses Playwright instead of Puppeteer (transparent to most users)
- **Exit codes**: Fixed to return 0 on success (previously returned 1)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build
npm run build
```

## License

MIT - Josep Vidal