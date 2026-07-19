// Contrast gate: every theme scope must clear WCAG 4.5:1 for tone/-content
// pairs and for body text pairs (fg/bg, fg/surface, muted/bg, muted/surface).
// Run: bun run check
import { readFileSync, readdirSync } from "node:fs";
import { checkContrastPairs, parseThemeScopes } from "./lib/contrast.mjs";

const themesDir = new URL("../src/themes/", import.meta.url);
const sources = [
  { name: "tokens.css", css: readFileSync(new URL("../src/base/tokens.css", import.meta.url), "utf8") },
  ...readdirSync(themesDir)
    .filter((f) => f.endsWith(".css"))
    .map((f) => ({
      name: f,
      css: readFileSync(new URL(f, themesDir), "utf8"),
    })),
];

const scopes = parseThemeScopes(sources);
const { failed, results } = checkContrastPairs(scopes);

for (const r of results) {
  if (r.missing) {
    console.error(`✗ ${r.scope}: --${r.pair.replace("/", " / --")} missing`);
    continue;
  }
  console.log(`${r.ok ? "✓" : "✗"} ${r.scope} --${r.pair.replace("/", " on --")}: ${r.ratio.toFixed(2)}:1`);
}

process.exit(failed ? 1 : 0);
