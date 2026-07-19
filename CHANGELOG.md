# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Public surface and deprecation rules: [`docs/versioning.md`](docs/versioning.md),
[`docs/public-surface.md`](docs/public-surface.md).

## [Unreleased]

### Added

- Versioning and deprecation policy (`docs/versioning.md`)
- Enumerated public Tier-1 + `data-*` surface (`docs/public-surface.md`)
- Contributor Covenant Code of Conduct
- Contributing guide, issue templates, and RFC path for vocabulary changes
- CI quality gates: expanded contrast pairs, Stylelint (utility-class bans),
  gzip size budget, axe-core kitchen-sink check, and JSDoc typecheck
- **Public `data-density="crisp|compact"`** — nestable, CSS-only density that
  retunes the spacing scale and control metrics. Crisp is the default and needs
  no attribute; kitchen-sink demos both, and the axe gate runs against each
  ([RFC 0001](docs/rfcs/0001-data-density.md))
- a11y gate enables axe's `target-size` rule (WCAG 2.2 AA 2.5.8), the rule
  Compact density can regress

### Changed

- Light/dark Tier-1 `--muted` / tone tokens tightened so body text, links, and
  soft components clear WCAG AA under axe-core (sRGB), not only the OKLCH gate
- Soft badges/alerts use `--_tone-ink` (tone mixed toward `--fg`) for readable
  text on tinted surfaces
- Stepper completed state prefers preceding `aria-current="step"`; `aria-checked`
  on `<li>` is deprecated (still styled this minor; remove next major)
- Nord and Dracula `--muted` tokens adjusted for AA against `--bg` and `--surface`

## [0.1.0] — 2026-07-12

### Added

- Initial public release of Hikarion UI: class-light CSS for semantic HTML,
  Tier-1 theming, community themes (nord, dracula, catppuccin), optional
  progressive-enhancement JS, agent rules, and kitchen-sink demo
