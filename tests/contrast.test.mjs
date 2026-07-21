import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  contrastRatio,
  parseThemeScopes,
  checkContrastPairs,
  TEXT_PAIRS,
  TONE_PAIRS,
} from "../scripts/lib/contrast.mjs";

describe("contrastRatio", () => {
  test("known light gray on white is low", () => {
    // oklch(70% 0 0) on oklch(100% 0 0) — secondary gray, well under AA
    const ratio = contrastRatio([0.7, 0, 0], [1, 0, 0]);
    expect(ratio).toBeLessThan(4.5);
    expect(ratio).toBeGreaterThan(2);
  });

  test("near-black on white clears AA", () => {
    const ratio = contrastRatio([0.24, 0.02, 260], [0.99, 0.004, 250]);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

describe("checkContrastPairs", () => {
  test("requires tone/-content and body text pairs", () => {
    const labels = [...TONE_PAIRS, ...TEXT_PAIRS].map(([a, b]) => `${a}/${b}`);
    expect(labels).toContain("accent/accent-content");
    expect(labels).toContain("fg/bg");
    expect(labels).toContain("fg/surface");
    expect(labels).toContain("muted/bg");
    expect(labels).toContain("muted/surface");
  });

  test("fails when muted on surface is below 4.5", () => {
    const scopes = {
      demo: {
        accent: [0.54, 0.2, 258],
        "accent-content": [0.99, 0.01, 258],
        success: [0.51, 0.14, 150],
        "success-content": [0.99, 0.02, 150],
        warning: [0.75, 0.15, 78],
        "warning-content": [0.3, 0.05, 78],
        danger: [0.55, 0.2, 27],
        "danger-content": [0.99, 0.02, 27],
        fg: [0.95, 0.01, 260],
        bg: [0.3, 0.02, 260],
        surface: [0.35, 0.02, 260],
        muted: [0.5, 0.02, 260],
      },
    };
    const { failed, results } = checkContrastPairs(scopes);
    expect(failed).toBe(true);
    expect(results.some((r) => r.pair === "muted/surface" && !r.ok)).toBe(true);
  });

  test("parses light theme tokens from CSS source", () => {
    const css = `
      :root {
        --bg: oklch(99% 0.004 250);
        --fg: oklch(24% 0.02 260);
        --surface: oklch(97% 0.006 250);
        --muted: oklch(52% 0.02 260);
        --accent: oklch(54% 0.2 258);
        --accent-content: oklch(99% 0.01 258);
      }
    `;
    const scopes = parseThemeScopes([{ name: "tokens.css", css }]);
    expect(scopes.light.fg[0]).toBeCloseTo(0.24, 2);
    expect(scopes.light.bg[0]).toBeCloseTo(0.99, 2);
  });
});

describe("prefers-contrast retune", () => {
  // Layered, it loses to the unlayered theme docs/overrides.md tells authors to
  // write — unlayered beats layered at any specificity. Guard the exception.
  test("the token pass is unlayered", () => {
    const css = readFileSync(new URL("../src/base/high-contrast.css", import.meta.url), "utf8");
    const beforeLayer = css.slice(0, css.indexOf("@layer"));
    expect(beforeLayer).toContain("--muted: var(--fg)");
    expect(beforeLayer).toContain("--border: var(--fg)");
  });
});
