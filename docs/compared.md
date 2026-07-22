# Compared to alternatives

The honest question before adopting Hikarion: why not [Pico](https://picocss.com),
[Open Props](https://open-props.style), or an afternoon writing your own tokens?
All three are good answers for some projects. This page says where each one is
the better choice, and what you are actually buying here.

## The short version

|  | Hikarion | Pico | Open Props | Your own tokens |
|---|---|---|---|---|
| What it is | Styled semantic HTML + a `data-*` vocabulary | Styled semantic HTML | A token package — styles nothing | Whatever you write |
| Bare tags styled | Yes | Yes | No | No |
| A theme is | ~20 tokens; the rest derives | 100+ variables | The props *are* the theme | Your call |
| Variants & components | `data-*` hooks, closed vocabulary | Classes + `role` attributes | None | Your call |
| Interactive behaviour | Native APIs, optional 10 kB JS | CSS only | None | Your call |
| Contrast guarantees | Gated in CI per theme | Not enforced | N/A | Your call |
| Browser floor | Spring 2023 ([why](./browser-support.md)) | Much older | Old | Your call |
| Agent contract | [Rules file, llms.txt, validator](../rules/hikarion-rules.md) | No | No | No |

Sizes are in the same league across the column — Hikarion's core CSS is ~9 kB
gzipped, and the others are single small files too. Size is not the deciding
axis here; the trade-offs above are.

## Pico — the nearest neighbour

Pico had the "semantic HTML looks good by default" idea first, and it is a
mature, widely used project. Two real differences:

- **The theming model.** A Pico theme is a long list of variables you set
  directly. A Hikarion theme is ~20 Tier-1 tokens; spacing, radius, shadows,
  tints and every state colour derive from them, and CI fails the theme if any
  derived pair drops below 4.5:1 contrast. You edit less and can break less —
  at the cost of less direct control ([theming](./theming.md)).
- **Interactive components.** Pico stops at CSS. Hikarion styles the native
  interactive layer — `<dialog>`, `popover`, `:user-invalid` — and ships an
  optional 10 kB script for the behaviours the platform doesn't cover yet
  (menu keyboard navigation, toasts, chip removal). That is also why the
  browser floor is spring 2023 rather than Pico's much older one.

**Choose Pico when** you need to support older browsers, or you want direct
variable-level control instead of a derivation system.

## Open Props — a different layer

Open Props is a set of well-chosen custom properties: colours, easings, sizes.
It styles nothing and has no opinion about your markup — you build the
components. It is not really an alternative to Hikarion; it is an alternative
to Hikarion's *token file*, with the component layer left as your homework.

**Choose Open Props when** you want raw material for your own design system
and enjoy that work. **Choose Hikarion when** you want the finished surface —
styled tags, variants, states, dark mode, density — and would rather theme it
than build it.

## Your own tokens

Twenty variables and some element selectors is an afternoon of work, and for a
small site you control end to end, it may genuinely be the right call — no
dependency, no vocabulary to learn.

What the afternoon does not buy is the part that took us the longest: contrast
gates across every theme and density, `:user-invalid` form states, focus
treatment, `prefers-reduced-motion` and `prefers-contrast` handling, an
[override model](./overrides.md) that never needs `!important`, and a
[machine-readable contract](../rules/hikarion-rules.md) so a coding agent
produces correct markup on the first try instead of inventing class names.
That last one compounds: hand-rolled CSS is exactly the dialect agents cannot
know.

**Write your own when** the surface is small and yours alone. **Use Hikarion
when** other people — or other people's agents — will write markup against it.

## Tailwind and component libraries

A different question. Utility classes and framework-bound component kits solve
"design system for an app team", and Hikarion does not compete there — it has
[no utility classes on purpose](./tokens.md) and no React. If your team wants
`class="flex items-center gap-2"`, you want Tailwind, and nothing on this page
argues otherwise. Hikarion is for pages where the markup should stay readable
HTML: content sites, docs, dashboards, admin surfaces, and anything an agent
writes.

## When not to choose Hikarion

- You must support browsers older than the [spring-2023 floor](./browser-support.md).
- You need a component your way, everywhere — the vocabulary is deliberately
  closed, and [the escape hatch](./overrides.md) is per-component, not per-token.
- You want a virtualized data grid, charts, or a rich text editor out of the
  box. Those are post-1.0 at best; today you would bring your own.
