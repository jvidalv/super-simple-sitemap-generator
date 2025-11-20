# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-01-20

### Added

- **URL normalization** - New `normalizeUrl()` function to remove trailing slashes for consistent deduplication

### Fixed

- **Duplicate URLs** - Fixed issue where URLs with and without trailing slashes (e.g., `https://example.com/` and `https://example.com`) were treated as separate URLs in the sitemap
- **README** - Removed broken image reference

### Changed

- All URLs are now normalized to remove trailing slashes for consistency

## [2.0.0] - 2025-01-20

### Added

- **TypeScript support** - Complete rewrite in TypeScript for better type safety and developer experience
- **Vitest testing framework** - Comprehensive test coverage with unit and integration tests
- **Custom output paths** - New `-o, --output` flag to specify where to save the sitemap
- **Programmatic API** - Can now be used as a library with full TypeScript support
- **Better error handling** - Graceful error recovery and detailed error reporting
- **Progress indicators** - Real-time progress feedback during crawling
- **Resource cleanup** - Proper browser and page cleanup to prevent memory leaks

### Changed

- **BREAKING**: Minimum Node.js version is now 18 (previously 10)
- **BREAKING**: Process now correctly exits with code 0 on success (previously 1)
- **Browser engine**: Migrated from Puppeteer to Playwright for better reliability
- **Dependencies**: Updated all dependencies to latest versions
  - commander: 4.x → 12.x
  - xmlbuilder: 13.x → 15.x
- **CLI interface**: Improved with Commander.js v12 argument parsing
- **Documentation**: Completely rewritten README with examples and API docs

### Fixed

- **URL matching bug**: Fixed brittle `substr(0, 25)` logic that failed for short URLs
- **Memory leaks**: Browser and page instances now properly closed after use
- **Error handling**: Better try/catch blocks throughout the codebase
- **Exit codes**: Now returns correct exit codes (0 for success, 1 for errors)
- **Typo**: Fixed "scrapper" → "scraper" throughout documentation

### Removed

- **Puppeteer dependency**: Replaced with Playwright
- **Legacy JavaScript code**: All converted to TypeScript
- **Unused configuration**: Cleaned up old code and configurations

## [1.0.5] - Previous versions

See git history for previous version changes.
