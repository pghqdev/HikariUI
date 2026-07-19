# RFC process — public vocabulary ownership

New public `data-*` hooks and new Tier-1 token names need an RFC **before** they
land. The vocabulary stays closed on purpose; every addition is forever for
consumers and agents.

## When an RFC is required

- Any new public `data-*` hook (or new documented value for an existing one)
- Any new Tier-1 token name
- Any change that would be a major under [`versioning.md`](./versioning.md)

Not required for Tier-2 internals, bug fixes, docs-only changes, or new themes
that only set existing Tier-1 tokens.

## How to propose

1. Open a GitHub Issue with the **Design proposal** template (or a PR that adds
   `docs/rfcs/NNNN-short-title.md` if the change is large).
2. Cover at least:
   - Problem and why semantic HTML / existing hooks are not enough
   - Proposed markup or token names (≤ 1–2 new hooks preferred)
   - Alternatives considered
   - Accessibility / progressive-enhancement impact
   - Migration or deprecation plan if anything is superseded
3. Wait for maintainer review. Do not merge vocabulary changes labeled
   `needs-triage` without an explicit accept.

## Ownership

Maintainers own the public surface listed in
[`public-surface.md`](./public-surface.md). Accepted RFCs update that file,
`rules/hikarion-rules.md`, and the CHANGELOG in the same change set.
