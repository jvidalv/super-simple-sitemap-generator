"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeout = timeout;
/**
 * Creates a promise-based setTimeout wrapper
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=timeout.js.map