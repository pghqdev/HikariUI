# Contributing

Thanks for helping with Hikarion. Please read the
[Code of Conduct](CODE_OF_CONDUCT.md) first.

## Local setup

```sh
bun install
bun run build     # CSS + themes + agent rule surfaces
bun run check     # contrast gate (required)
bun test          # unit tests for check scripts
bun run typecheck # JSDoc check on the optional JS surface
bun run lint:css  # Stylelint (includes utility-class bans)
```

After `bun run build`, optional gates that need the kitchen-sink / browser:

```sh
bun run check:size   # gzip budget for dist/hikarion.min.css
bun run check:a11y   # axe-core against kitchen-sink.html
```

CI runs the full set on every pull request.

## Design & vocabulary expectations

- **Class-light, not utility-first.** Do not add utility-class patterns or
  restyle components with freestyle classes.
- **Semantic HTML first.** New patterns should prefer native elements; add a
  `data-*` hook only when a variant truly needs it.
- **Closed vocabulary.** New public hooks or Tier-1 names require an
  [RFC](docs/rfc.md) before merge.
- **Stay inside `@layer hikarion`.** Consumer CSS must keep winning without
  `!important`.
- Use domain language from [`CONTEXT.md`](CONTEXT.md) and respect ADRs in
  [`docs/adr/`](docs/adr/).

The agent-facing contract is [`rules/hikarion-rules.md`](rules/hikarion-rules.md).
If you change a public hook or Tier-1 token, update that file,
[`docs/public-surface.md`](docs/public-surface.md), and `CHANGELOG.md` together.

## Themes

Community themes are welcome when they:

- Set only existing Tier-1 tokens (no new public names without an RFC)
- Pass `bun run check` (WCAG AA contrast on gated pairs)

See [`docs/public-surface.md`](docs/public-surface.md) for the token list.

## Pull requests

- Keep diffs focused; match existing CSS and JS style.
- Prefer small vertical slices over large speculative abstractions.
- Run `bun run build && bun run check && bun test && bun run typecheck && bun run lint:css`
  before requesting review. Add size/a11y checks when your change touches CSS
  or kitchen-sink markup.
