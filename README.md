<div align="center">

# Hikarion UI

**Bare HTML, already styled.**

A class-light CSS framework for semantic HTML. Write plain tags and they come
out styled. A small `data-*` vocabulary adds variants, and a `data-theme`
container restyles the whole page from ~20 tokens.

[Docs & live playground](https://pghqdev.github.io/HikarionUI/) · [Agent rules](rules/hikarion-rules.md) · [npm](https://www.npmjs.com/package/hikarion-ui)

</div>

---

## Why

Developers — increasingly AI coding agents at the keyboard — need UI that looks
good without styling work. Models write excellent semantic HTML but freestyle
inconsistent utility classes, and every result looks like the same AI slop.
Classless frameworks (Pico, Water) are too minimal to build real UIs;
class-heavy ones (Bootstrap, DaisyUI) trade away the semantic-HTML identity.

Hikarion styles **bare semantic HTML** by default, themes from a small token
set, and ships an [agent-adoption layer](#for-coding-agents) so an agent told
to "use Hikarion" writes documented vocabulary instead of freestyling.

## Quick start

One `<link>` is the whole install:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hikarion-ui@0.1.0/dist/hikarion.min.css">
<script src="https://cdn.jsdelivr.net/npm/hikarion-ui@0.1.0/dist/hikarion.js" defer></script>
```

Pin a version and add `integrity` for subresource verification — hashes and
unpkg/theme URLs are in [docs/cdn.md](docs/cdn.md).

Or via npm:

```sh
npm install hikarion-ui
```
```js
import "hikarion-ui";          // hikarion.css
import "hikarion-ui/js";       // optional progressive enhancement
```

Then just write HTML — no classes:

```html
<button>Just works</button>
<button data-variant="solid">Primary</button>
<article>
  <h3>A card</h3>
  <p>Bare &lt;article&gt; — a quiet surface with a hairline.</p>
</article>
```

## How it works

- **Class-light.** Bare semantic tags are styled by default. Variants come from
  native attributes and a small `data-*` vocabulary — never utility classes.
- **~20 tokens are a theme.** Tier-1 is a hard-capped set of tokens that *are* a
  theme (`--bg --fg --surface --accent --accent-content --radius --space …`).
  Tier-2 (spacing scale, radius scale, shadows, tints) derives from Tier-1 via
  OKLCH `color-mix()` — you never touch it. Switch the accent and the shadows
  re-tint for free.
- **`data-theme` swaps everything.** Set it on any container; themes nest. Dark
  mode is automatic from the OS, overridable per-region.
- **`data-density` retunes the rhythm.** `crisp` (default) for product UI,
  `compact` for dense views. CSS-only, and it nests like `data-theme`.
- **Your overrides always win.** Everything is wrapped in `@layer hikarion`, so
  any unlayered CSS you write beats it — no `!important` needed.

## Components

Buttons · card (`<article>`) · nav & sidebar · breadcrumbs · pagination · badge ·
chip · avatar · alert · toast · tabs · accordion (`<details>`) · dialog (native
`<dialog>`) · dropdown menu (native popover) · button group / split button ·
tooltip · data table · form layout · file dropzone · switch · select & combobox ·
spinner & progress · skeleton · empty state · stepper · scroll-progress bar,
plus styled forms with native `:user-invalid` validation.

Every one is bare semantic HTML plus, at most, one `data-*` hook.
[`rules/hikarion-rules.md`](rules/hikarion-rules.md) is the component reference:
markup contract, usage and accessibility notes for each, and it is the same file
agents consume — so the docs cannot drift from what agents are told.

The one variant grammar, everywhere:

```html
<span data-badge data-variant="success">Passing</span>
<div role="alert" data-variant="danger">Something failed</div>
<button data-variant="danger solid">Delete</button>
```
`data-variant="<tone> [solid]"`, tone ∈ `accent` `success` `warning` `danger`.

## Themes

Ships light and dark; opt into more with one extra `<link>` and `data-theme`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hikarion-ui@0.1.0/dist/themes/nord.min.css">
<body data-theme="nord">…</body>
```

Included: **nord**, **dracula**, **catppuccin**. A theme is ~13 colour tokens
and nothing else; every `accent`/`success`/`warning`/`danger` pairs with a
readable `-content` token, gated at 4.5:1 contrast by `bun run check`.

## For coding agents

Point your agent at the canonical rules and it writes on-vocabulary Hikarion
markup instead of utility-class slop. Install the Claude Code Skill:

```sh
curl -fsSL https://raw.githubusercontent.com/pghqdev/HikarionUI/main/skills.sh | sh
```

All three surfaces derive from one source ([`rules/hikarion-rules.md`](rules/hikarion-rules.md)):

- **Skill** — `skills.sh` above (add `-s -- --global` for user scope).
- **`AGENTS.md`** — drop into a consuming repo as project rules.
- **`llms.txt`** — served at the docs domain root for doc-fetchers.

## Documentation

| Doc | What's in it |
|-----|--------------|
| [rules/hikarion-rules.md](rules/hikarion-rules.md) | **Component reference.** Every hook, its markup contract, usage and a11y notes. Canonical — `llms.txt`, the consumer `AGENTS.md` and the agent Skill all derive from it. |
| [docs/tokens.md](docs/tokens.md) | Every token, its formula, and who owns it. Plus what density does and does not move. |
| [docs/overrides.md](docs/overrides.md) | Customising without fighting `@layer`, shipping a theme, and adopting Hikarion into an existing codebase. |
| [docs/browser-support.md](docs/browser-support.md) | Version matrix and, more usefully, what you get when a feature is missing. |
| [docs/accessibility.md](docs/accessibility.md) | Keyboard, ARIA, user preferences, and what degrades without JavaScript. |
| [docs/public-surface.md](docs/public-surface.md) | The frozen contract — what you may depend on. |
| [docs/versioning.md](docs/versioning.md) · [docs/cdn.md](docs/cdn.md) · [docs/visual-regression.md](docs/visual-regression.md) | SemVer policy · CDN URLs and SRI hashes · screenshot baselines |

## Browser support

Modern-first with graceful fallback. The floor is **Chrome 111 / Safari 16.2 /
Firefox 113** (`@layer`, OKLCH, `color-mix()`); newer features — container
queries, anchor positioning, View Transitions, invoker commands, scroll-driven
animations — are enhancements, each with a designed fallback rather than a
polyfill. [docs/browser-support.md](docs/browser-support.md) states exactly what
you get without each one.

## Development

```sh
bun install
bun run build       # bundle CSS + themes, generate agent surfaces (Lightning CSS)
bun run check       # contrast gate: tone pairs + body text pairs ≥ 4.5:1
bun test            # unit tests for check scripts
bun run typecheck   # JSDoc check on the optional JS surface
bun run lint:css    # Stylelint + utility-class bans
bun run check:size  # gzip budget for dist/hikarion.min.css (after build)
bun run check:a11y  # axe-core against kitchen-sink.html (after build)
bun run check:visual # screenshot baselines (needs Docker; skips without it)
bun run ci          # full quality gate
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for vocabulary/RFC expectations; the table
above for everything else.

The framework is authored in plain modern CSS partials under `src/`; Lightning
CSS is the only runtime build dependency and the shipped artifact is
runtime-dependency-free. The docs site lives in `site/` (Astro).

## What Hikarion deliberately doesn't do

No utility classes. No JS framework. No build step for you. It styles pages you
own and yields to any pre-existing site CSS — that's the trade for zero-config
taste, not an oversight.

## License

[MIT](LICENSE)
