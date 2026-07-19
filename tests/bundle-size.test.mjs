import { describe, expect, test } from "bun:test";
import { evaluateBudget, DEFAULT_GZIP_BUDGET_BYTES } from "../scripts/lib/bundle-size.mjs";

describe("evaluateBudget", () => {
  test("budget sits in the production band (≤ 22 kB gzipped)", () => {
    expect(DEFAULT_GZIP_BUDGET_BYTES).toBeLessThanOrEqual(22 * 1024);
    expect(DEFAULT_GZIP_BUDGET_BYTES).toBeGreaterThan(0);
  });

  test("passes when gzip size is under budget", () => {
    const result = evaluateBudget({ gzipBytes: 6_144, budgetBytes: 18 * 1024 });
    expect(result.ok).toBe(true);
  });

  test("fails when gzip size exceeds budget", () => {
    const result = evaluateBudget({ gzipBytes: 19_000, budgetBytes: 18 * 1024 });
    expect(result.ok).toBe(false);
    expect(result.gzipBytes).toBe(19_000);
  });
});
