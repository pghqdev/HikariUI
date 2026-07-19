# HikarionUI — Production Readiness & Evolution Handoff

**Document purpose**  
Actionable pointers to take HikarionUI from v0.1 experimental prototype to a production-grade, feature-complete, and forward-looking class-light CSS framework.

**Audience**  
Library maintainers, contributors, and AI coding agents working on the project.

**Core identity (non-negotiable)**  
- Class-light, not classless and not utility-first  
- Semantic HTML first; `data-*` only when a variant is required  
- ~20 Tier-1 tokens are a theme; everything else derives  
- `@layer hikarion` so consumer CSS always wins  
- Agent-friendly closed vocabulary  
- **Opinionated, strong, systematic design** that feels intentional and high-craft across a wide range of use cases  

**Design stance**  
Hikarion is inspired by the systematic rigor of IBM Carbon, adapted for non-enterprise software. It is bold and opinionated — decisive hierarchy, confident accent usage, product-like density, expressive but purposeful motion, and distinctive typography — while remaining free of decorative or overly artistic expression.  

It is **not** bland, cautious, conservative, or neutral for the sake of neutrality.  
The goal is strong design that simply works.

Any change that violates the above should be rejected.

---

## 1. Current State Snapshot (July 2026)

| Area                    | Status                          | Notes |
|-------------------------|---------------------------------|-------|
| Version                 | 0.1.0                           | First public release |
| Stars / Community       | Near zero                       | No real adoption yet |
| Component coverage      | Core set only                   | Buttons, cards, badges, forms, dialog, tabs, accordion, etc. |
| Documentation           | Single demo page + rules.md     | Insufficient for production |
| Testing                 | Contrast gate only              | No visual regression, a11y, or unit tests |
| Browser support         | Modern evergreen only           | Intentional; will expand with graceful fallbacks |
| JS layer                | Minimal progressive enhancement | Toasts, tabs, chips, dialog polyfill |
| Theming                 | Light/dark + 3 community themes | Solid foundation |
| Agent surface           | Excellent                       | rules.md + skill + AGENTS.md + llms.txt |

---

## 2. Path to Production Ready

### 2.1 Stability & Versioning
- Adopt strict **Semantic Versioning**. Treat any change to the public `data-*` vocabulary or Tier-1 token names as a major version.
- Publish a formal `CHANGELOG.md` (Keep a Changelog format).
- Introduce a deprecation policy: warn for one minor, remove in next major.
- Freeze the public CSS custom property surface early. Internal derived tokens can change freely.

### 2.2 Quality Gates (CI)
Required checks before every release:

1. **Contrast** — existing `bun run check` (keep and expand to more pairs).
2. **Visual regression** — Playwright or Chromatic against a kitchen-sink page + all themes + both density modes.
3. **Accessibility** — axe-core + manual keyboard audit on every component.
4. **Bundle size** — fail if minified CSS exceeds a defined budget (recommend ≤ 18–22 kB gzipped for core).
5. **CSS linting** — Stylelint with modern rules + custom rules that ban utility-class patterns.
6. **Type checking** for the JS surface (move to TypeScript or JSDoc + tsc).

### 2.3 Accessibility (must reach WCAG 2.2 AA)
- Full keyboard support and visible focus for every interactive pattern.
- Prefer native elements; when custom (tabs, chips), implement the official ARIA Authoring Practices correctly.
- Support `prefers-reduced-motion`, `prefers-contrast`, and forced-colors mode.
- Document the expected focus order and any focus traps (dialogs).
- Add `aria-live` regions for toasts and dynamic status messages.
- Provide a high-contrast theme token set or automatic adjustment.
- **Community themes must also meet WCAG 2.2 AA.**

### 2.4 Progressive Enhancement Contract
Document and test the following guarantee:

> Every component remains usable and readable with JavaScript disabled, except pure enhancement features (toasts, interactive tabs, chip removal, drag-and-drop feedback, advanced motion).

Ship the JS as a separate optional entry (`hikarion-ui/js`) and never make core styling depend on it.  
**JavaScript is proactively welcomed** for progressive enhancement, richer interactions, and better UX — as long as it remains optional.

### 2.5 Documentation Requirements for Production
- Component reference (one page per component or a well-structured single page).
- Full token reference with live playground (already partially exists — expand).
- Density mode documentation (Crisp / Compact).
- “Migration / Override” guide (how to safely customize without fighting the cascade).
- Accessibility notes per component.
- Browser support matrix with explicit modern-first + graceful fallback policy.
- Kitchen-sink page that is also the visual regression baseline.
- Agent rules kept in sync with the component vocabulary (single source of truth).

### 2.6 Packaging & Distribution
- Proper ESM + CSS exports (already good).
- Optional “critical” subset or layer-based import if size becomes an issue.
- CDN integrity hashes in documentation.
- GitHub Releases with minified artifacts and source maps (CSS source maps are valuable).

### 2.7 Community & Maintenance Hygiene
- Code of Conduct + Contributing guide.
- Issue templates (bug, feature, design proposal).
- Clear ownership of the design tokens and vocabulary (RFC process for new `data-*` attributes).
- Monthly or quarterly “state of the library” note even if quiet.
- Community themes accepted only if they pass WCAG 2.2 AA contrast and accessibility checks.

---

## 3. Feature-Set Completeness Gaps

Aim for a *focused* complete set rather than a kitchen-sink library. Prioritize patterns that work elegantly with semantic HTML + minimal data attributes.

### High Priority (next 1–2 minor versions)
| Component / Pattern          | Notes / Preferred Approach |
|-----------------------------|----------------------------|
| Data Table                  | Native `<table>` + `data-table` for density, sticky header, row selection via `aria-selected` |
| Select / Combobox           | Native `<select>` styled well + progressive enhancement for searchable combobox |
| Menu (context & action)     | Expand native Popover + `data-menu` (already started) |
| Navigation (sidebar + top)  | Semantic `<nav>` patterns with clear active states |
| Empty / Zero states         | Consistent `data-empty` or role-based pattern |
| Skeleton loaders            | Pure CSS, token-driven, respects reduced motion |
| Progress (linear + circular)| Native `<progress>` + CSS-only circular via `data-spinner` expansion |
| Avatar + Avatar Group       | Simple `data-avatar` with image / initials fallback |
| Form layout helpers         | Fieldset, form groups, horizontal/vertical stacks via minimal attributes |
| Toast / Notification stack  | Improve positioning, stacking, and dismissal (keep JS optional) |
| Density system              | First-class `data-density="crisp \| compact"` (or equivalent token-driven mode) |

### Medium Priority
- Command palette / search dialog pattern (native dialog + listbox)
- Date / time inputs (style native first; avoid heavy custom calendars unless necessary)
- Pagination (already sketched — polish)
- Breadcrumbs (already sketched — polish)
- Tooltip (already present — ensure accessible and delay-controlled)
- Split button / button group
- Meter and range polish
- File upload with preview slots

### Explicitly Out of Scope (for now)
- Full data-grid with virtualization
- Rich text editor
- Complex charts / data visualization
- Mobile-first navigation drawers that fight native
- Heavy animation systems that cannot degrade gracefully

Keep the vocabulary closed. New components should almost never introduce more than 1–2 new `data-*` attributes.

---

## 4. Cutting-Edge Opportunities

**Policy**: Adopt bleeding-edge CSS features **extremely aggressively**, as long as they are supported by modern browsers and every feature has a graceful fallback for older browsers.  

Golden rule:  
> Every feature targeted at a modern browser must have a usable fallback.

### Strong Candidates
1. **Anchor Positioning**  
   Primary approach for tooltips, dropdowns, and menus. Fallback to current Popover / JS positioning.

2. **Scroll-Driven Animations**  
   Subtle progress indicators, sticky header effects, and reveal animations. Fully disabled under `prefers-reduced-motion`.

3. **View Transitions API**  
   Smooth theme switching, density switching, and page/section transitions. Progressive enhancement only.

4. **Container Queries + Style Queries**  
   Context-aware components (card density, button sizing, navigation behavior) without utility classes.

5. **Relative Colors, `light-dark()`, and advanced color-mix**  
   Further simplify and strengthen the theme system.

6. **CSS Nesting & Cascade Layers**  
   Already using `@layer` — expand disciplined nesting for maintainability.

7. **Popover & Invoker Commands**  
   Continue leaning hard into native declarative patterns (`commandfor`, `popovertarget`, etc.).

8. **Customizable Select (when stable)**  
   Prepare styles for the emerging customizable `<select>` appearance.

9. **Spring-based and expressive motion** via CSS (linear(), custom easings, or small optional JS) with reduced-motion fallbacks.

### AI / Agent Evolution
- Expand the rules file into a formal “Hikarion Design Language” that agents can reason about.
- Provide a small set of high-quality example compositions (dashboard, settings page, auth form, data table views, etc.) that agents can reference.
- Consider a lightweight validation script that agents can run against generated markup.

---

## 5. Design System Direction & Recommendations

### 5.1 Overall Personality
Hikarion should feel **sharp, intentional, and product-like**.  

Target reaction when someone sees an interface built with it:  
> “This feels precise, confident, and well-built.”

It draws systematic rigor from Carbon while rejecting enterprise heaviness and corporate caution. It is more expressive and opinionated than classic minimal systems, but never decorative or artistic for its own sake.

### 5.2 Density (First-Class Concern)
Density is a core theme concern.

- **Crisp** (default direction): Product-like, confident spacing, clear hierarchy, slightly tighter than traditional “comfortable” systems.
- **Compact**: High information density for data-heavy views, still readable and precise.

Expose via a simple mechanism (`data-density="crisp|compact"` or equivalent Tier-1 token set). Both modes must be fully designed and tested, not afterthoughts.

### 5.3 Elevation & Depth
- Intentional elevation scale (0–4 levels) with clear material meaning.
- Shadows and borders should feel crisp and high-quality rather than soft/diffused by default.
- Surfaces should read as distinct layers without the heavy stacked-panel look of classic enterprise systems.

### 5.4 Motion Language
Be more expressive than traditional enterprise systems:

- Springy transitions and purposeful micro-interactions are welcome.
- Short, confident durations with distinctive easing.
- Clear state-change feedback (hover → active → selected).
- All motion must respect `prefers-reduced-motion: reduce` (disable decorative motion, keep essential state changes).

Motion should feel alive and polished, not playful for its own sake and not stiff.

### 5.5 Typography
Opinionated and distinctive:

- More dramatic type scale.
- Tighter tracking on smaller UI text where appropriate.
- Stronger hierarchy between headings, body, labels, and captions.
- Distinctive but practical font pairings (system stack or carefully chosen variable fonts are fine; no requirement for a single branded typeface).
- Excellent support for mixed scripts.

Typography should contribute clear character without becoming ornamental.

### 5.6 Color & Accent
- Decisive use of accent color — solid buttons, selected states, and focus should feel confident, not timid.
- Maintain a clean role-based color system (inspired by Carbon’s thinking) while allowing the accent to have real presence.
- Refined soft vs solid variants.
- Disabled states should feel intentionally quiet and precise.
- High-contrast and forced-colors support required.

### 5.7 Focus & Interaction Feedback
- Beautiful, consistent, high-visibility focus rings that feel native to the system.
- Confident hover and active states.
- Selected / pressed states should be unambiguous.

### 5.8 Spacing & Rhythm
- Product-like spacing rhythm that supports the Crisp default.
- Vertical rhythm should feel tight and intentional rather than airy or cautious.
- Consistent alignment and optical adjustments across components.

### 5.9 Micro-details that Signal Craft
- Refined border-radius scale that feels consistent and contemporary.
- Precise hairlines and dividers.
- High-quality form controls (especially checkbox, radio, switch, range, file).
- Optional pure-CSS or lightweight icons that feel native to the system.

### Inspiration References (study the systems, do not copy the enterprise weight)
- IBM Carbon → systematic rigor, token discipline, layer thinking, accessibility
- Linear → precision, density options, modern product feel
- Raycast → keyboard-first clarity and craft
- Vercel / Geist → clean contemporary execution
- High-quality modern SaaS tools that feel sharp without being loud

Avoid: heavy glassmorphism as default, neon, exaggerated gradients, skeuomorphism, and anything that prioritizes visual novelty over clarity and usability.

---

## 6. Suggested Phased Roadmap

### Phase 0 — Foundation (current → 0.2)
- Harden CI (contrast + visual + a11y + size)
- Expand documentation to component reference level
- Polish existing components and close a11y gaps
- Formalize the public token & data-* surface
- Introduce density system (Crisp default + Compact)

### Phase 1 — Completeness (0.3–0.5)
- Ship the high-priority missing components (table, select, nav patterns, skeleton, empty states, avatar)
- Improve toast system and form layouts
- Full reduced-motion and high-contrast support
- First real adoption examples / reference compositions
- Stronger typography scale and motion language landed

### Phase 2 — Craft & Edge (0.6–1.0)
- Mature elevation system + expressive but disciplined motion
- Aggressive adoption of Anchor Positioning, View Transitions, Container Queries, etc. (with fallbacks)
- Density modes fully refined across all components
- Community theme guidelines + WCAG 2.2 AA gate
- Reach 1.0 only when the vocabulary feels stable and the component set covers the large majority of common UI needs without breaking the philosophy

### Post-1.0
- Optional high-quality community themes
- Thin framework wrappers only if they stay CSS-first
- Continuous performance and size discipline

---

## 7. Success Metrics

- Bundle size stays under a declared budget
- All components pass automated a11y checks + manual keyboard audit
- Contrast gate remains green on every theme and density mode
- Agent-generated markup using the rules file consistently looks intentional and on-brand
- Density modes (especially Crisp) feel native rather than bolted on
- At least a small number of real projects adopt it without needing heavy overrides
- Breaking changes are rare and well-communicated after 1.0
- Community themes that are accepted all meet WCAG 2.2 AA

---

## 8. Resolved Open Questions

1. **How aggressively should the library adopt bleeding-edge CSS features that still have incomplete support?**  
   → Adopt bleeding-edge CSS features extremely aggressively as long as they are supported by modern browsers, with graceful fallback for older browsers.  
   Golden rule: every feature targeted towards a modern browser must have a fallback.

2. **Is a small amount of optional JavaScript acceptable long-term, or should the goal be pure CSS for everything possible?**  
   → JavaScript is proactively welcomed, as long as it remains optional.

3. **Should density (comfortable/compact) become a first-class theme concern?**  
   → Yes. **Crisp & Compact** is the way to go. Density is a first-class concern.

4. **How much visual personality is allowed before the “quietly tasteful” identity is compromised?**  
   → We explicitly want:
   - More expressive motion (springy transitions, playful micro-interactions)
   - More opinionated typography (tighter tracking, more dramatic scale, distinctive font pairings)
   - Density or spacing that feels more “product-like” and less neutral  

   The identity is strong, opinionated, and systematic — not bland or cautious.

5. **Will the project accept community themes, and under what quality bar?**  
   → Yes, provided they are WCAG 2.2 AA compatible.

---

## Closing Note

HikarionUI’s strength will come from combining three things that rarely sit together cleanly:

1. Class-light semantic HTML discipline  
2. Systematic, Carbon-inspired rigor  
3. Bold, product-like opinion (density, motion, typography, accent confidence)

Stay ruthless about keeping the public vocabulary small and the token surface elegant. Be generous with modern CSS and optional JavaScript. Be decisive in visual direction.

Ship fewer things, polish them to a high standard of craft, and treat both human developers and AI agents as first-class users of the system.

---

*Document revised July 2026 — design direction updated for bold, opinionated, Carbon-inspired systematic strength with Crisp/Compact density and expressive modern craft.*
