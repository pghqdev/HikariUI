# RFC 0001 — `data-density`

Status: **accepted**
Adds one public `data-*` hook. Follows [`rfc.md`](../rfc.md).

## Problem

Hikarion has one rhythm. It suits product UI and is too airy for
information-dense work — admin tables, dashboards, log views. Semantic HTML has
no density concept, and no existing hook covers it: `data-theme` swaps the
palette, `data-variant` carries tone. Neither is about spacing.

The alternative authors reach for today is overriding `--space` on a container.
That works for gaps but not for control metrics, which were hard-coded in rem,
so buttons and fields stayed product-sized inside a "dense" region.

## Proposal

One hook, two values, on any container:

```html
<body>                                  <!-- Crisp: the default -->
  <article data-density="compact">…</article>
</body>
```

| Value | Meaning |
|-------|---------|
| `crisp` | Default. Needed only to opt a subtree out of an enclosing Compact. |
| `compact` | Dense views. |

Internally two Tier-2 multipliers, `--_density` and `--_density-type`, feed the
spacing scale and a small set of control metrics (`--control-py/px`,
`--field-py/px`, `--control-fz`, `--control-fz-sm`). Both are internal; authors
never set them. Themes are unaffected — density is orthogonal to palette, and
the two nest independently.

## Alternatives considered

- **Per-component size attribute** (`data-size="sm"` on each button). Rejected:
  it's a utility class wearing a `data-*` costume, and it puts the decision at
  every call site instead of once per region.
- **A `compact` theme.** Rejected: it would fork every shipped theme in two, and
  density genuinely is orthogonal to colour.
- **Author-set `--space` override only.** Rejected as the whole story — it can't
  reach control padding or type, which is why dense regions looked half-done.
  It still works, and still composes with `data-density`.

## Accessibility / progressive enhancement

CSS-only; no JS, so it survives with scripting off and cannot break at runtime.
The risk density introduces is target size: WCAG 2.2 AA 2.5.8 wants 24×24 CSS
px. The a11y gate (`bun run check:a11y`) now runs axe against the kitchen-sink
in **both** modes with the `target-size` rule explicitly enabled, so a Compact
control shrinking under the minimum fails CI. Smallest Compact targets today:
pagination cells at 27px, buttons at ~31px.

Contrast is unaffected — density changes no colour token — but the axe pass in
both modes covers it regardless.

## Migration

Purely additive. Crisp is the default and matches the existing rhythm exactly
(`--_density: 1`), so no existing page changes. Nothing is superseded, so there
is no deprecation.
