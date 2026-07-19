// Bundle each opt-in theme in src/themes/ to dist/themes/<name>.css (+ .min.css).
// Themes ship as standalone files — one extra <link> per theme — so they stay
// out of the core bundle. Run: bun run build:themes
import { readdirSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const srcDir = new URL("src/themes/", root);
const outDir = new URL("dist/themes/", root);
const bin = fileURLToPath(new URL("node_modules/.bin/lightningcss", root));
mkdirSync(outDir, { recursive: true });

const themes = readdirSync(srcDir).filter((f) => f.endsWith(".css"));
for (const file of themes) {
  const src = fileURLToPath(new URL(file, srcDir));
  const out = fileURLToPath(new URL(file, outDir));
  const min = out.replace(/\.css$/, ".min.css");
  execFileSync(bin, ["--bundle", src, "-o", out]);
  execFileSync(bin, ["--bundle", "--minify", src, "-o", min]);
}
console.log(`✓ ${themes.length} themes → dist/themes/`);
