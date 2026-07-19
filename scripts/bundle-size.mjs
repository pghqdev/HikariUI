// Fail if minified core CSS exceeds the declared gzip budget.
// Run after build: bun run check:size
import { readFileSync } from "node:fs";
import { evaluateFileBytes, DEFAULT_GZIP_BUDGET_BYTES } from "./lib/bundle-size.mjs";

const file = new URL("../dist/hikarion.min.css", import.meta.url);
const result = evaluateFileBytes(readFileSync(file), {
  budgetBytes: Number(process.env.HIKARION_CSS_GZIP_BUDGET || DEFAULT_GZIP_BUDGET_BYTES),
});

const kb = (n) => (n / 1024).toFixed(1);
console.log(
  `${result.ok ? "✓" : "✗"} hikarion.min.css gzip ${kb(result.gzipBytes)} kB (budget ${kb(result.budgetBytes)} kB)`,
);
process.exit(result.ok ? 0 : 1);
