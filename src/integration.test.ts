import { describe, it, expect, afterEach } from 'vitest';
import { Sitemapper } from './models/Sitemapper';

describe('Integration Tests', () => {
  let mapper: Sitemapper | null = null;

  afterEach(async () => {
    if (mapper) {
      await mapper.close();
      mapper = null;
    }
  });

  it('should create a Sitemapper instance and initialize', async () => {
    mapper = new Sitemapper(500, 10, 'https://example.com');
    await mapper.init();

    expect(mapper).toBeDefined();
    expect(mapper.getUrls()).toContain('https://example.com');
  });

  it('should generate XML sitemap structure', async () => {
    mapper = new Sitemapper(500, 10, 'https://example.com');

    // Generate XML without parsing (empty sitemap)
    mapper.generateXml();
    const xml = mapper.getXml();

    expect(xml).toContain('<?xml version="1.0"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    // Accept both self-closing and separate closing tags
    expect(xml).toMatch(/<\/urlset>|<urlset[^>]*\/>/);
  });

  it('should handle browser lifecycle properly', async () => {
    mapper = new Sitemapper(500, 10, 'https://example.com');

    // Initialize
    await mapper.init();

    // Close
    await mapper.close();

    // Should be able to close again without error
    await expect(mapper.close()).resolves.not.toThrow();
  });
});
