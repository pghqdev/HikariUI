// Contrast gate for the tone seam: every Tier-1 tone / -content pair in
// tokens.css must clear WCAG 4.5:1 (solid fills use -content as text on the
// tone). Dependency-free: parses oklch() literals, converts to linear sRGB,
// computes relative luminance. Run: bun run check
import { readFileSync, readdirSync } from "node:fs";

const TONES = ["accent", "success", "warning", "danger"];
const themesDir = new URL("../src/themes/", import.meta.url);
const sources = [
  new URL("../src/base/tokens.css", import.meta.url),
  ...readdirSync(themesDir).filter((f) => f.endsWith(".css")).map((f) => new URL(f, themesDir)),
];

// Scope name → { token → [L, C, H] }, from `selector { ... }` blocks. The
// regex flattens @media nesting, so classify auto-dark (:root:not([data-theme])
// under prefers-color-scheme: dark) before the bare :root — it contains :root
// too, and it's a distinct palette that must clear the gate on its own. Any
// [data-theme="<name>"] is that named theme's scope (nord, dracula, …).
const scopes = {};
for (const url of sources) {
  for (const [, selector, body] of readFileSync(url, "utf8").matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const themed = selector.match(/\[data-theme="([\w-]+)"\]/);
    const name = selector.includes(":not([data-theme])") ? "auto-dark"
      : themed ? themed[1]
      : selector.includes(":root") && !selector.includes("[data-theme]") ? "light"
      : null;
    if (!name) continue;
    for (const [, token, args] of body.matchAll(/--([\w-]+):\s*oklch\(([^)]+)\)/g)) {
      const [L, C, H] = args.trim().split(/\s+/).map(parseFloat);
      (scopes[name] ??= {})[token] = [args.includes("%") ? L / 100 : L, C, H];
    }
  }
}

function luminance([L, C, H]) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const r = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

let failed = false;
for (const [scope, tokens] of Object.entries(scopes)) {
  for (const tone of TONES) {
    const pair = [tokens[tone], tokens[`${tone}-content`]];
    if (!pair[0] || !pair[1]) {
      console.error(`✗ ${scope}: --${tone} pair missing from tokens.css`);
      failed = true;
      continue;
    }
    const [y1, y2] = pair.map(luminance);
    const ratio = (Math.max(y1, y2) + 0.05) / (Math.min(y1, y2) + 0.05);
    const ok = ratio >= 4.5;
    if (!ok) failed = true;
    console.log(`${ok ? "✓" : "✗"} ${scope} --${tone}: ${ratio.toFixed(2)}:1`);
  }
}
process.exit(failed ? 1 : 0);
