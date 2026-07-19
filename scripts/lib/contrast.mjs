// Contrast helpers for the tone + body-text seams.
// Tone/-content pairs must clear 4.5:1 (solid fills). Body text pairs
// (fg/bg, fg/surface, muted/bg, muted/surface) must also clear 4.5:1.

export const TONES = ["accent", "success", "warning", "danger"];

/** @type {Array<[string, string]>} */
export const TONE_PAIRS = TONES.map((tone) => [tone, `${tone}-content`]);

/** @type {Array<[string, string]>} */
export const TEXT_PAIRS = [
  ["fg", "bg"],
  ["fg", "surface"],
  ["muted", "bg"],
  ["muted", "surface"],
];

const MIN_RATIO = 4.5;

/** Relative luminance from OKLCH [L, C, H] with L in 0–1. */
export function luminance([L, C, H]) {
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

export function contrastRatio(a, b) {
  const [y1, y2] = [a, b].map(luminance);
  return (Math.max(y1, y2) + 0.05) / (Math.min(y1, y2) + 0.05);
}

/**
 * Parse theme scopes from CSS sources.
 * @param {Array<{ name?: string, css: string }>} sources
 * @returns {Record<string, Record<string, [number, number, number]>>}
 */
export function parseThemeScopes(sources) {
  const scopes = {};
  for (const { css } of sources) {
    for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const themed = selector.match(/\[data-theme="([\w-]+)"\]/);
      const name = selector.includes(":not([data-theme])")
        ? "auto-dark"
        : themed
          ? themed[1]
          : selector.includes(":root") && !selector.includes("[data-theme]")
            ? "light"
            : null;
      if (!name) continue;
      for (const [, token, args] of body.matchAll(/--([\w-]+):\s*oklch\(([^)]+)\)/g)) {
        const [L, C, H] = args.trim().split(/\s+/).map(parseFloat);
        (scopes[name] ??= {})[token] = [args.includes("%") ? L / 100 : L, C, H];
      }
    }
  }
  return scopes;
}

/**
 * @param {Record<string, Record<string, [number, number, number]>>} scopes
 * @param {{ minRatio?: number }} [opts]
 */
export function checkContrastPairs(scopes, opts = {}) {
  const minRatio = opts.minRatio ?? MIN_RATIO;
  const pairs = [...TONE_PAIRS, ...TEXT_PAIRS];
  /** @type {Array<{ scope: string, pair: string, ok: boolean, ratio?: number, missing?: boolean }>} */
  const results = [];
  let failed = false;

  for (const [scope, tokens] of Object.entries(scopes)) {
    for (const [a, b] of pairs) {
      const pair = `${a}/${b}`;
      const left = tokens[a];
      const right = tokens[b];
      if (!left || !right) {
        failed = true;
        results.push({ scope, pair, ok: false, missing: true });
        continue;
      }
      const ratio = contrastRatio(left, right);
      const ok = ratio >= minRatio;
      if (!ok) failed = true;
      results.push({ scope, pair, ok, ratio });
    }
  }

  return { failed, results };
}
