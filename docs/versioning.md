# Versioning & deprecation

Hikarion follows [Semantic Versioning 2.0.0](https://semver.org/).

## What counts as a breaking change (major)

Any of the following is a **major** version:

- Renaming, removing, or changing the meaning of a **Tier-1** token
- Renaming, removing, or changing the contract of a public `data-*` hook or
  `data-variant` grammar value
- Changing a public JS API (`Hikarion.init`, `Hikarion.toast`, `Hikarion.setTheme`)
  in a backward-incompatible way
- Removing a documented progressive-enhancement behavior that consumers rely on

Internal (Tier-2) tokens and private implementation details may change in any
release without a major bump.

The frozen public surface is enumerated in [`public-surface.md`](./public-surface.md).

## Deprecation policy

1. **Warn for one minor.** A public name or hook that will be removed is marked
   deprecated in the CHANGELOG and docs, and kept working through at least the
   next minor release.
2. **Remove in the next major.** Deprecated surface is removed only in a major
   version, never in a minor or patch.

Deprecations should name the replacement (if any) and the earliest major in
which removal is expected.

## Patch vs minor

- **Patch** — bug fixes, contrast/a11y fixes that do not change public names,
  documentation, and CI/tooling that does not alter the published contract.
- **Minor** — new optional hooks, new themes, additive JS helpers, and other
  backward-compatible expansions of the public surface.
