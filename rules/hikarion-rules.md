# Hikarion UI — rules for coding agents

Hikarion is a class-light CSS framework for semantic HTML. Bare tags look great with
no classes; a small `data-*` vocabulary adds variants; a `data-theme` container
swaps the whole palette. This file is the single source of truth — `llms.txt`,
the consumer `AGENTS.md`, and the installable Skill all derive from it.

## Prime directive

Write bare, correct semantic HTML. Reach for the right element first
(`<button>`, `<dialog>`, `<details>`, `<article>`, `<nav>`, a real `<label>`),
and add a **documented** `data-*` attribute only when a variant needs it.

**Never freestyle utility classes for styling.** No Tailwind, no
`class="flex gap-2 rounded-lg bg-…"`. That is the "AI slop" Hikarion exists to
replace. If you're writing a class to style something, stop — either the bare
tag already handles it, or there's a `data-*` hook below, or it's layout you
own (see "Your own CSS").

## Rules

- **Semantic tag before wrapper.** A button is `<button>`, not `<div role="button">`. A card is `<article>`. Navigation is `<nav>`. Let the element carry the meaning; Hikarion styles it.
- **Only the hooks below exist.** Do not invent `data-*` attributes — an undocumented hook does nothing. The vocabulary is closed and small on purpose.
- **Theme with Tier-1 tokens only.** Restyle by setting the ~20 Tier-1 tokens on a `[data-theme]` container. Never touch Tier-2 (internal, derived) tokens.
- **No `!important`, ever.** Hikarion lives in `@layer hikarion`; any unlayered CSS you write already wins the cascade. If you're reaching for `!important`, you don't need it.
- **Tones are `accent` `success` `warning` `danger`.** There is no `info` tone. Tone names mirror the token names.
- **Don't add another CSS framework.** No Bootstrap, no Tailwind reset, no second design system. Hikarion is the whole surface.

## Component vocabulary

Every hook is a bare `data-*` attribute (no modifiers) or a native element.
Variants come from `data-variant`, which uses **one grammar everywhere**:

```
data-variant="<tone> [solid]"   tone ∈ accent | success | warning | danger
```

`solid` (opt-in) fills with the tone and uses its readable `-content` pair as
text. Without `solid`, a toned component is **soft**: a translucent tint of the
tone over its background. Omit `data-variant` for the neutral default.

### Buttons
```html
<button>Default</button>
<button data-variant="solid">Primary action</button>       <!-- accent fill -->
<button data-variant="danger solid">Delete</button>        <!-- destructive -->
```
Buttons take a tone **only** with `solid`; there is no soft toned button.
Reserve the one solid primary for a view's single main action.

### Card
```html
<article>
  <h3>Title</h3>
  <p>A quiet raised surface with a hairline. No classes.</p>
</article>
```

### Nav
Bare `<nav>` — links inside are muted, underline-free until hover.
```html
<nav>
  <a href="/">Home</a> · <a href="/docs">Docs</a> · <a href="/themes">Themes</a>
</nav>
```

### Breadcrumbs
A trail to the current page — `<nav data-breadcrumbs>` of a list. The last
item is the current page (`aria-current="page"`, muted, not a link).
```html
<nav data-breadcrumbs>
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/docs">Docs</a></li>
    <li><a href="/docs/tokens" aria-current="page">Tokens</a></li>
  </ol>
</nav>
```
Items separated by the shared chevron, rotated to point inline.

### Pagination
Page navigation — `<nav data-pagination>` of buttons/links. The active page
carries `aria-current="page"` (accent ring); first/last use `aria-disabled`.
```html
<nav data-pagination>
  <button aria-disabled="true">Prev</button>
  <a href="?p=1">1</a>
  <a href="?p=2" aria-current="page">2</a>
  <a href="?p=3">3</a>
  <button>Next</button>
</nav>
```
Disabled pages use `aria-disabled="true"` (not the native `disabled`) so they
stay in the tab order and the a11y tree.

### Definition list
Bare `<dl>` — terms are muted, small-capped; definitions indent under their term.
```html
<dl>
  <dt>Token</dt>
  <dd>A CSS custom property a theme author sets to restyle the framework.</dd>
  <dt>Hook</dt>
  <dd>A bare <code>data-*</code> attribute that identifies an element as a component.</dd>
</dl>
```

### Badge
```html
<span data-badge>Neutral</span>
<span data-badge data-variant="success">Passing</span>     <!-- soft -->
<span data-badge data-variant="danger solid">3 errors</span>
```

### Chip
A filter/input token. Chips carry **selection, not tone** — no `data-variant`.
```html
<button data-chip aria-pressed="true">All</button>         <!-- selectable filter -->
<button data-chip aria-pressed="false">Components</button>
<span data-chip>filter.css <button data-chip-remove aria-label="Remove">✕</button></span>
```
With `hikarion.js`, clicking a filter chip toggles `aria-pressed`; a
`data-chip-remove` button removes its chip.

### Alert
A callout. The ARIA role is an independent a11y choice from the tone.
```html
<div role="status" data-variant="success"><strong>Saved</strong> — changes are live.</div>
<div role="alert" data-variant="danger"><strong>Failed</strong> — couldn't reach the server.</div>
<div role="alert" data-variant="danger solid">Deleted — the record is gone.</div>
```
Use `role="alert"` for errors, `role="status"` for confirmations.

### Toast (JS)
Transient feedback, via `hikarion.js`. No markup — call the helper:
```js
Hikarion.toast("Changes saved");
Hikarion.toast("Couldn't reach the server", { variant: "danger" });
Hikarion.toast("Undo available", { duration: 8000, closable: true });
```

### Tabs
Minimal markup; `hikarion.js` wires ARIA roles, roving arrow-key nav, and panel
visibility. With no JS every panel stays visible (nothing is hidden).
```html
<div data-tabs>
  <div data-tab-list>
    <button aria-selected="true">Overview</button>
    <button>Details</button>
  </div>
  <div data-tab-panel>…</div>
  <div data-tab-panel>…</div>
</div>
```
Panels map 1:1 to the buttons, in order.

### Accordion
Native disclosure — no JS, no hook.
```html
<details>
  <summary>What is Hikarion?</summary>
  <p>Bare details/summary; the chevron rotates on open.</p>
</details>
```

### Dialog (modal)
Native `<dialog>`, opened with native command invokers. `hikarion.js` polyfills
invokers only where the browser lacks them.
```html
<button commandfor="confirm" command="show-modal">Open</button>
<dialog id="confirm">
  <h3>Confirm</h3>
  <button commandfor="confirm" command="close">Close</button>
</dialog>
```

### Dropdown menu
Native Popover API. The button opens the menu; the browser owns toggle,
light-dismiss, and focus.
```html
<button popovertarget="menu">Actions</button>
<div id="menu" popover data-menu>
  <button>Edit</button>
  <a href="/share">Share</a>
  <hr>
  <button>Delete</button>
</div>
```
A `[popovertarget]` button placed immediately before its `[data-menu]` gets a
chevron that flips on open.

### Tooltip
CSS-only supplementary hint. **Not** an accessible name — the element still
needs real visible text or `aria-label`.
```html
<button data-tooltip="Copied to clipboard" aria-label="Copy">Copy</button>
```

### Forms
Bare fields. Wire `<label for>` to the field's `id`.
```html
<label for="email">Email</label>
<input id="email" type="email" required placeholder="you@example.com">
```
Validation is native: `:user-invalid` styles the field's edge in `--danger`
after the user interacts (never on pristine load). For JS-driven validation with
no native constraint, set `aria-invalid="true"`.

Native gauge and computed-value elements are styled too:
```html
<label for="vol">Volume <output for="vol">50</output></label>
<input id="vol" type="range" min="0" max="100" value="50">

<label for="upload">Upload</label>
<progress id="upload" value="62" max="100"></progress>
<progress></progress>                    <!-- indeterminate: a moving stripe -->

<label for="disk">Disk usage</label>
<meter id="disk" value="0.4" min="0" max="1" low="0.66" high="0.85" optimum="0.1"></meter>

<input type="file">                     <!-- styled as a quiet dashed surface -->
```
`<progress>` and `<meter>` fill with the accent; `<meter>` regions tint via
the status tones (optimum→success, low/high→warning, suboptimum→danger).
`<output>` reads as a small monospaced value. All ride the same focus and
reduced-motion rules as the other fields.

### File dropzone
A drag-and-drop upload surface — `label[data-dropzone]` wrapping a hidden
`input[type="file"]`. `hikarion.js` adds drag-over highlight and writes the
chosen filename into a `[data-dropzone-filename]` slot.
```html
<label data-dropzone>
  <input type="file" hidden>
  <span data-dropzone-filename>Drop files here or click to browse</span>
</label>
```
CSS-only without JS (the dashed surface + native picker still work); the JS is
purely the drag-over highlight and filename display.

### Switch
A binary on/off toggle — distinct from a checkbox. `<input type="checkbox"
data-switch>` with a `<label for>` for the accessible name.
```html
<label for="notify"><input id="notify" type="checkbox" data-switch checked> Notifications</label>
<label for="del"><input id="del" type="checkbox" data-switch data-variant="danger" checked> Destructive</label>
```
`data-variant="<tone>"` retints the active track via the tone resolver.

### Spinner
CSS-only loading ring — `[data-spinner]`. No JS; reduced-motion pauses it.
```html
<span data-spinner></span>                       <!-- standalone -->
<button disabled><span data-spinner></span> Saving…</button>
```
Inline next to text or standalone; the ring is the accent (or the active tone
on a toned ancestor).

### Stepper
A multi-step flow indicator — `<ol data-stepper>` of step items. No JS; state
is ARIA-driven: `aria-checked="true"` on completed steps, `aria-current="step"`
on the active one.
```html
<ol data-stepper>
  <li aria-checked="true"><button>Account</button></li>
  <li aria-current="step"><button>Profile</button></li>
  <li><button>Confirm</button></li>
</ol>
```
Completed steps show a check and tint their connector with the accent; the
active step gets an accent ring. Stacks vertically on narrow viewports.

## Theming

A `data-theme` container swaps the whole palette — colors, depth, and glow.
Themes nest.
```html
<body>                              <!-- OS light/dark, automatic -->
  <section data-theme="dark">…</section>   <!-- forced dark region -->
</body>
```
Theme switch + persistence via `hikarion.js`:
```html
<button data-set-theme="light">Light</button>
<button data-set-theme="dark">Dark</button>
<button data-set-theme="auto">Auto</button>
```
Paste this inline in `<head>` **before** the stylesheet to prevent a theme flash
(it can't be deferred):
```html
<script>try{var t=localStorage.getItem("hikarion-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
```

## Tier-1 tokens

These ~20 tokens **are** a theme. Set them on `:root` or a `[data-theme]`
container to restyle everything. Every `accent`/`success`/`warning`/`danger`
pairs with a readable `-content` token, gated at 4.5:1 contrast for solid fills.

```
--bg  --fg  --surface  --muted  --border
--accent  --accent-content
--success  --success-content
--warning  --warning-content
--danger   --danger-content
--radius  --space
--ease-hikarion  --dur
--font  --mono
```

Colors are OKLCH. Depth and tints are mixed from `--accent`, so switching the
accent re-lights shadows for free. You never set Tier-2 tokens (spacing scale,
radius scale, shadows, tint recipe) — Hikarion derives them.

## Your own CSS

Hikarion is a starting point, not a cage. Layout that is yours to own — page grid,
one-off spacing, bespoke components Hikarion doesn't cover — is plain CSS you
write unlayered; it always wins over Hikarion with no `!important`. The rule
against freestyling is about **restyling Hikarion's components** with utility
classes, not about you owning your page's layout.

## Install

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hikarion-ui/dist/hikarion.min.css">
<script src="https://cdn.jsdelivr.net/npm/hikarion-ui/dist/hikarion.js" defer></script>
```
`hikarion.js` is optional (theme switch/persistence, tabs, toast, dialog polyfill,
chip toggle, copy buttons). Every helper is documented as paste-it-yourself
vanilla, so the JS stays optional. Call `Hikarion.init(root)` after injecting
markup to wire it — it's idempotent.
