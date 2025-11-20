import { describe, it, expect } from 'vitest';
import { timeout } from './timeout';

describe('timeout', () => {
  it('should resolve after the specified time', async () => {
    const start = Date.now();
    await timeout(100);
    const elapsed = Date.now() - start;

    // Allow some tolerance for timing
    expect(elapsed).toBeGreaterThanOrEqual(90);
    expect(elapsed).toBeLessThan(200);
  });

  it('should resolve immediately with 0ms', async () => {
    const start = Date.now();
    await timeout(0);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(50);
  });

  it('should return a Promise', () => {
    const result = timeout(10);
    expect(result).toBeInstanceOf(Promise);
  });
});
