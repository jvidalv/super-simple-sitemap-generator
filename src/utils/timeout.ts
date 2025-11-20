/**
 * Creates a promise-based setTimeout wrapper
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export async function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
