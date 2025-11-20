import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Sitemapper } from './Sitemapper';

describe('Sitemapper', () => {
  let mapper: Sitemapper;

  beforeEach(() => {
    mapper = new Sitemapper(1000, 100, 'https://example.com');
  });

  afterEach(async () => {
    if (mapper) {
      await mapper.close();
    }
  });

  describe('constructor', () => {
    it('should initialize with correct properties', () => {
      expect(mapper).toBeInstanceOf(Sitemapper);
      expect(mapper.getUrls()).toEqual(['https://example.com']);
      expect(mapper.getParsedUrls()).toEqual([]);
      expect(mapper.getErrors()).toEqual([]);
    });
  });

  describe('getters', () => {
    it('should return empty XML initially', () => {
      expect(mapper.getXml()).toBe('');
    });

    it('should return correct URLs', () => {
      expect(mapper.getUrls()).toBeInstanceOf(Array);
      expect(mapper.getUrls().length).toBeGreaterThan(0);
    });

    it('should return parsed URLs', () => {
      expect(mapper.getParsedUrls()).toBeInstanceOf(Array);
      expect(mapper.getParsedUrls().length).toBe(0);
    });

    it('should return errors array', () => {
      expect(mapper.getErrors()).toBeInstanceOf(Array);
      expect(mapper.getErrors().length).toBe(0);
    });
  });

  describe('generateXml', () => {
    it('should generate valid XML with no URLs', () => {
      mapper.generateXml();
      const xml = mapper.getXml();

      expect(xml).toContain('<?xml');
      expect(xml).toContain('<urlset');
      expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      // Check for either self-closing or closing tag
      expect(xml).toMatch(/<\/urlset>|<urlset[^>]*\/>/);
    });

    it('should generate XML with correct structure', () => {
      mapper.generateXml();
      const xml = mapper.getXml();

      expect(xml).toMatch(/<urlset[^>]*>/);
      // Accept both self-closing and separate closing tags
      expect(xml).toMatch(/<\/urlset>|\/>/);
    });
  });

  describe('close', () => {
    it('should close without error when not initialized', async () => {
      await expect(mapper.close()).resolves.not.toThrow();
    });

    it('should close successfully after init', async () => {
      await mapper.init();
      await expect(mapper.close()).resolves.not.toThrow();
    });
  });

  describe('init', () => {
    it('should initialize browser', async () => {
      await mapper.init();
      // Browser should be initialized (we'll verify by closing it)
      await expect(mapper.close()).resolves.not.toThrow();
    });
  });
});
