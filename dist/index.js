#!/usr/bin/env node
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
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Sitemapper_1 = require("./models/Sitemapper");
// Read package.json for version
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
/**
 * Command line interface
 */
const program = new commander_1.Command();
program
    .version(pkg.version)
    .name('sitemap')
    .usage('[options] <url>')
    .description('Generates a sitemap.xml file by crawling a website')
    .option('-w, --wait <milliseconds>', 'time to wait before parsing the page (for CSR pages)', '1500')
    .option('-l, --limit <number>', 'maximum number of URLs to parse', '99999')
    .option('-o, --output <path>', 'output file path', 'sitemap.xml')
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
    const mapper = new Sitemapper_1.Sitemapper(wait, limit, url);
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
    }
    catch (error) {
        console.error('\n✗ Error:', error instanceof Error ? error.message : String(error));
        // Ensure cleanup even on error
        try {
            await mapper.close();
        }
        catch (closeError) {
            // Ignore cleanup errors
        }
        process.exit(1);
    }
}
run().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map