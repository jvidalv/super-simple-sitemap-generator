import { describe, it, expect } from 'vitest';
import { urlContainsPage, isUrlAnAnchor, getDate, normalizeUrl } from './urls';

describe('urlContainsPage', () => {
  it('should return true when URL starts with the base page', () => {
    expect(urlContainsPage('https://example.com/about', 'https://example.com')).toBe(true);
    expect(urlContainsPage('https://example.com/blog/post', 'https://example.com')).toBe(true);
  });

  it('should return false when URL does not start with the base page', () => {
    expect(urlContainsPage('https://other.com/page', 'https://example.com')).toBe(false);
    expect(urlContainsPage('https://sub.example.com', 'https://example.com')).toBe(false);
  });

  it('should work with short URLs (regression test for substr bug)', () => {
    // This tests the fix for the substr(0, 25) bug
    expect(urlContainsPage('https://a.co', 'https://a.co')).toBe(true);
    expect(urlContainsPage('https://a.co/p', 'https://a.co')).toBe(true);
  });

  it('should handle exact matches', () => {
    expect(urlContainsPage('https://example.com', 'https://example.com')).toBe(true);
  });
});

describe('isUrlAnAnchor', () => {
  it('should return true for URLs with anchors', () => {
    expect(isUrlAnAnchor('https://example.com#section')).toBe(true);
    expect(isUrlAnAnchor('https://example.com/page#top')).toBe(true);
    expect(isUrlAnAnchor('#anchor')).toBe(true);
  });

  it('should return false for URLs without anchors', () => {
    expect(isUrlAnAnchor('https://example.com')).toBe(false);
    expect(isUrlAnAnchor('https://example.com/page')).toBe(false);
    expect(isUrlAnAnchor('https://example.com/page?param=value')).toBe(false);
  });
});

describe('getDate', () => {
  it('should return a date in YYYY-MM-DD format', () => {
    const date = getDate();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should return the current date', () => {
    const date = getDate();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const expected = `${year}-${month}-${day}`;

    expect(date).toBe(expected);
  });

  it('should pad single digit months and days with zero', () => {
    const date = getDate();
    const parts = date.split('-');

    expect(parts).toHaveLength(3);
    expect(parts[0]).toHaveLength(4); // year
    expect(parts[1]).toHaveLength(2); // month
    expect(parts[2]).toHaveLength(2); // day
  });
});

describe('normalizeUrl', () => {
  it('should remove trailing slash from path URLs', () => {
    expect(normalizeUrl('https://example.com/about/')).toBe('https://example.com/about');
    expect(normalizeUrl('https://example.com/blog/post/')).toBe('https://example.com/blog/post');
  });

  it('should keep URLs without trailing slash unchanged', () => {
    expect(normalizeUrl('https://example.com/about')).toBe('https://example.com/about');
    expect(normalizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('should remove trailing slash from root domain', () => {
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com');
  });

  it('should handle complex paths', () => {
    expect(normalizeUrl('https://example.com/blog/2023/post/')).toBe('https://example.com/blog/2023/post');
    expect(normalizeUrl('https://example.com/a/b/c/')).toBe('https://example.com/a/b/c');
  });

  it('should deduplicate URLs with and without trailing slashes', () => {
    const url1 = normalizeUrl('https://josepvidal.dev/');
    const url2 = normalizeUrl('https://josepvidal.dev');
    // Both should be the same after normalization (without trailing slash)
    expect(url1).toBe(url2);
    expect(url1).toBe('https://josepvidal.dev');
  });
});
