import { describe, expect, test } from "bun:test";
import stylelint from "stylelint";
import plugin from "../scripts/stylelint-ban-utility-classes.mjs";

async function lint(code) {
  return stylelint.lint({
    code,
    config: {
      plugins: [plugin],
      rules: {
        "hikarion/ban-utility-classes": true,
        "selector-class-pattern": null,
      },
    },
  });
}

describe("hikarion/ban-utility-classes", () => {
  test("rejects a Tailwind-like utility selector", async () => {
    const { results } = await lint(".flex { display: flex; }");
    expect(results[0].warnings.length).toBeGreaterThan(0);
    expect(results[0].warnings[0].text).toContain("utility-class");
  });

  test("allows hk-* framework classes", async () => {
    const { results } = await lint(".hk-copy { position: absolute; }");
    expect(results[0].warnings).toHaveLength(0);
  });

  test("allows data-attribute selectors", async () => {
    const { results } = await lint("[data-badge] { display: inline-flex; }");
    expect(results[0].warnings).toHaveLength(0);
  });
});
