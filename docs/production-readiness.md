# Production Readiness — Gap Evaluation

_Evaluated 2026-07-19 against `HikarionUI-Production-Handoff.md`, at v0.1.0 / commit `434d26c`._

Current: 2217 lines of source CSS, 25 `data-*` hooks, **6.1 kB gzipped** (min 31 kB raw).

---

## 0. Resolved: the old exclusions were the mistake

`docs/gap-analysis.md` rejected four components as out-of-philosophy. **Those
rejections were themselves out-of-philosophy** and are overruled. All four are
in scope.

| Item | Old (wrong) reason | Why it actually fits |
|------|--------------------|----------------------|
| Avatar / Avatar Group | "Not semantic HTML — no hook needed" | "Not a semantic element" was never the bar — `data-chip`, `data-badge`, `data-stepper` aren't either. `<img data-avatar>` with an initials fallback is one hook. |
| Skeleton loaders | "Decorative; author in user CSS" | A loading state is a *state*, not decoration. Pushing it to user CSS guarantees every consumer reinvents it off-token and off-motion-policy. |
| Command palette | "JS-heavy; not a base component" | Native `<dialog>` + listbox. JS is proactively welcomed as long as it stays optional (handoff §8.2) — "JS-heavy" stopped being a rejection reason. |
| Date / time inputs | "JS-dependent; outside scope" | `<input type="date">` is native and ships unstyled — exactly the class of element this framework exists to fix. Style native; no custom calendar. |

The common error: the old file used *implementation cost* and *element
nativeness* as philosophy tests. The real tests are the ones in §0 of the rules —
closed vocabulary, semantic-first markup, optional JS, token-driven. All four
pass. Scope discipline still applies to what's genuinely out (§3 of the handoff:
data-grid virtualization, rich text, charts).

`docs/gap-analysis.md` is deleted; this file replaces it.

---

## 1. ADD — missing, blocking

### 1.1 Density system (largest single gap)
Handoff calls density "first-class". **Zero density code exists** — `grep density`
returns only the word "crisp" in four comments. Nothing is parameterised on it.

Needs: `data-density="crisp|compact"` switching a Tier-1 `--space` + type-scale
set, applied at every component's padding/gap/line-height. Cannot be bolted on
later cheaply — every component that hardcodes `--space-N` must route through it.

### 1.2 Typography scale
No type tokens exist at all. `--font`/`--mono` are the only typographic Tier-1
entries; sizes are presumably literal in `elements.css`. Handoff wants a
"dramatic scale, tighter tracking on small UI text, stronger hierarchy."

Needs: `--text-xs…--text-3xl` + tracking tokens as Tier-2, derived from a Tier-1
base size + ratio. Also the density hook (§1.1).

### 1.3 CI quality gates
`.github/workflows/` contains **only `deploy-site.yml`**. `bun run check`
(contrast) exists but runs nowhere automatically.

Needs, in priority order:
1. Run `bun run check` on every PR — the cheapest gate, already written.
2. Size budget check. Current 6.1 kB vs the handoff's 18–22 kB ceiling — set the
   budget at ~12 kB, not 22; 22 gives away 3× headroom for no reason.
3. axe-core against `kitchen-sink.html` × 4 themes × 2 density modes.
4. Visual regression (Playwright). Same matrix.
5. Stylelint.

### 1.4 Accessibility gaps
- **No `forced-colors` support** anywhere. One `outline: 2px solid transparent`
  in `elements.css:397` is the entire provision. Handoff requires it.
- **No `prefers-contrast` support.** Handoff requires a high-contrast token set.
- `prefers-reduced-motion` is handled as a global killswitch in `reset.css:57` —
  correct approach, but it kills *all* motion including essential state feedback.
  Handoff asks for decorative-off/essential-on.
- No `aria-live` documented for toasts (JS may set it — unverified).

### 1.5 Modern CSS adoption
Handoff: adopt "extremely aggressively". Present reality — the only modern
feature in use is `@starting-style` + `allow-discrete` (motion.css) and
`appearance: base-select` (elements.css). Absent entirely:

| Feature | Where it belongs |
|---------|------------------|
| Anchor positioning | tooltip, dropdown, `data-menu` — currently CSS-positioned |
| Container queries | card/nav/button context sizing |
| Style queries | density propagation without attribute plumbing |
| `light-dark()` | would collapse the triple-declared dark palette (tokens.css 44–84) |
| View transitions | theme + density switching |
| `linear()` easing | the "springy" motion the handoff asks for |
| Scroll-driven animations | stepper/progress indicators |

`light-dark()` is the highest-value single change: `tokens.css` currently
declares the dark palette **twice, identically** (lines 48–62 and 69–83) with a
load-bearing `:not([data-theme])` guard. That duplication is a drift hazard the
contrast gate only partly covers.

### 1.6 Missing components (handoff High Priority)
Present: table, select, breadcrumbs, pagination, spinner, stepper, switch,
dropzone, tabs, dialog, toast, tooltip, chip, badge, alert, card, accordion,
dropdown, progress/meter/range/file.

Missing: **data-table density/sticky/selection**, **nav patterns** (`<nav>` is
normalised but there's no sidebar/top-nav pattern), **empty states**,
**skeleton**, **avatar + group**, **form layout helpers**, **combobox
enhancement**. Toast stacking needs the polish pass.

Also in scope per §0, at medium priority: **command palette** (native `<dialog>`
+ listbox), **date/time inputs** (style native only).

### 1.7 Community & release hygiene
Absent: `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, issue
templates, RFC process for new `data-*`, deprecation policy, CDN integrity
hashes, CSS source maps, browser support matrix.

---

## 2. UPDATE — exists but insufficient

| Thing | Issue |
|-------|-------|
| Elevation scale | 3 levels (`--shadow-sm/--shadow/--shadow-lg`). Handoff wants 0–4 with distinct material meaning. |
| Motion vocabulary | One recipe (overlay pop), `--dur` 0.16s, two cubic-beziers. Handoff wants an expressive language with distinct easings per interaction class. |
| `package.json` | `"main": "dist/hikarion.min.css"` but `exports["."]` is the *unminified* file. Pick one. No `"types"` for the JS entry. |
| `src/hikarion.js` | 290 lines, untyped. Handoff requires typecheck — JSDoc + `tsc --checkJs` is the cheap path; don't port to TS. |
| Contrast gate | Covers status pairs. Must expand to community themes and both density modes. |
| Docs | One demo page + `rules.md`. Component reference, token playground, per-component a11y notes, override guide all missing. |
| `kitchen-sink.html` | Exists (17 kB) — needs to become the *tested* VR baseline, not just a demo. |

---

## 3. REMOVE

| Path | Why |
|------|-----|
| `docs/gap-analysis.md` | Stale (2025-07), fully complete, contradicts current direction. Superseded by this file. **Done.** |

Nothing else needs removing from version control — `dist/`, `site/dist/`, and
`site/public/` are already gitignored, and only 50 files are tracked.

One local-only cleanup: `site/public/` holds stale `hikari.min.css`, `hikari.js`,
and `hikari-rules.md` beside their `hikarion.*` replacements — leftovers from the
rename that `site/sync-assets.mjs` no longer writes. Untracked, so they cost
nothing in the repo, but they will be published if the site build copies the
whole directory. Worth deleting locally and confirming the sync script prunes.

---

## 4. Recommended sequencing

Density and typography must land **before** the component push, because both
change every component's internals. Doing components first means touching them
twice.

1. **Foundation** — density system, type scale, `light-dark()` token collapse,
   elevation 0–4, motion language. Formalise + freeze the public token surface.
2. **Gates** — contrast in CI, size budget at 12 kB, axe-core, stylelint, JSDoc
   typecheck. Cheap, and they protect everything after.
3. **Components** — nav, empty, skeleton, avatar, table density/selection, form
   layout, toast stacking.
4. **Modern CSS** — anchor positioning, container/style queries, view
   transitions, `linear()` springs. Each with a fallback.
5. **Hygiene + docs** — CHANGELOG, CONTRIBUTING, CoC, templates, component
   reference, browser matrix.

Steps 1–2 are 0.2. Step 3 is 0.3–0.5. Step 4 is 0.6+.

---

## 5. Where the project is already ahead

- **Size**: 6.1 kB gzipped against an 18–22 kB budget. Enormous headroom — the
  budget should be tightened, not spent.
- **Token architecture**: the Tier-1/Tier-2 split with per-`[data-theme]`
  re-derivation (including accent-tinted shadows) is genuinely good and needs no
  rework to support density.
- **Agent surface**: `rules/`, `AGENTS.md`, `llms.txt`, `skills.sh`, `CONTEXT.md`,
  ADRs — already at the level the handoff describes as a goal.
- **Vocabulary discipline**: 25 `data-*` hooks for ~19 components. Closed and
  tight, as intended.
