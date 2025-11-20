#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { Sitemapper } from './models/Sitemapper';

// Read package.json for version
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
);

/**
 * Command line interface
 */
const program = new Command();

program
  .version(pkg.version)
  .name('sitemap')
  .usage('[options] <url>')
  .description('Generates a sitemap.xml file by crawling a website')
  .option(
    '-w, --wait <milliseconds>',
    'time to wait before parsing the page (for CSR pages)',
    '1500'
  )
  .option(
    '-l, --limit <number>',
    'maximum number of URLs to parse',
    '99999'
  )
  .option(
    '-o, --output <path>',
    'output file path',
    'sitemap.xml'
  )
  .argument('<url>', 'URL to start crawling from')
  .addHelpText('after', `
Example:
  $ sitemap --wait 2500 https://example.com
  $ sitemap -w 1000 -l 100 -o my-sitemap.xml https://mysite.com
  `);

program.parse(process.argv);

const options = program.opts();
const url = program.args[0];

async function run() {
  if (!url) {
    console.error('Error: URL argument is required');
    console.log('Run "sitemap --help" for usage information');
    process.exit(1);
  }

  const wait = parseInt(options.wait);
  const limit = parseInt(options.limit);
  const outputPath = options.output;

  console.log(`Starting sitemap generation for: ${url}`);
  console.log(`Wait time: ${wait}ms | Limit: ${limit} URLs\n`);

  const mapper = new Sitemapper(wait, limit, url);

  try {
    await mapper.init();

    // Parse the base URL
    console.log(`[1/${limit}] Parsing ${url}...`);
    await mapper.parse(url);

    // Parse all discovered URLs
    let count = 1;
    while (mapper.getUrls().length > 0 && mapper.getParsedUrls().length < limit) {
      const nextUrl = mapper.getUrls()[0];
      count++;
      console.log(`[${count}/${limit}] Parsing ${nextUrl}...`);
      await mapper.parse(nextUrl);
    }

    // Generate XML
    console.log('\nGenerating sitemap.xml...');
    mapper.generateXml();

    // Write to file
    fs.writeFileSync(outputPath, mapper.getXml());

    // Display results
    console.log('\n✓ Sitemap generated successfully!');
    console.log(`  - URLs parsed: ${mapper.getParsedUrls().length}`);
    console.log(`  - Output file: ${path.resolve(outputPath)}`);

    const errors = mapper.getErrors();
    if (errors.length > 0) {
      console.log(`\n⚠ Encountered ${errors.length} error(s) during parsing:`);
      errors.slice(0, 5).forEach(error => {
        console.log(`  - ${error.message}`);
      });
      if (errors.length > 5) {
        console.log(`  ... and ${errors.length - 5} more`);
      }
    }

    // Cleanup
    await mapper.close();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error:', error instanceof Error ? error.message : String(error));

    // Ensure cleanup even on error
    try {
      await mapper.close();
    } catch (closeError) {
      // Ignore cleanup errors
    }

    process.exit(1);
  }
}

run().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
