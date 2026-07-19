import { gzipSync } from "node:zlib";

// Declared budget for core minified CSS (handoff target band ≤ 18–22 kB gzipped).
// Gate at the band floor; current artifact is ~6 kB.
export const DEFAULT_GZIP_BUDGET_BYTES = 18 * 1024;

/**
 * @param {{ gzipBytes: number, budgetBytes?: number }} input
 */
export function evaluateBudget({ gzipBytes, budgetBytes = DEFAULT_GZIP_BUDGET_BYTES }) {
  return {
    ok: gzipBytes <= budgetBytes,
    gzipBytes,
    budgetBytes,
  };
}

/**
 * @param {Uint8Array | Buffer | string} bytes
 * @param {{ budgetBytes?: number }} [opts]
 */
export function evaluateFileBytes(bytes, opts = {}) {
  const buf = typeof bytes === "string" ? Buffer.from(bytes) : Buffer.from(bytes);
  const gzipBytes = gzipSync(buf).byteLength;
  return evaluateBudget({ gzipBytes, budgetBytes: opts.budgetBytes });
}
