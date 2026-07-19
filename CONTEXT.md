# Hikarion

A class-light CSS framework for semantic HTML: bare tags look great, and a small
set of design tokens *is* the theme. The token set and the markup contracts are
the entire public interface.

## Language

**Token**:
A CSS custom property a theme author sets to restyle the framework.
_Avoid_: variable, setting

**Tier-1**:
The rationed set of tokens that constitute a theme; every theme must define all
of them.
_Avoid_: core tokens, base tokens

**Tier-2**:
Tokens derived from Tier-1 by the framework itself; never authored by users.
_Avoid_: computed tokens, internal tokens

**Hook**:
The bare data-attribute that identifies an element as a component
(`data-badge`, `data-chip`). Carries no modifiers.
_Avoid_: marker, class, selector

**Tone**:
A semantic color role — `accent`, `success`, `warning`, or `danger` — applied to
a component via `data-variant`. Tone names mirror the Tier-1 token names; there
is no `info` tone.
_Avoid_: status color, variant color, info

**Tone resolver**:
The single seam that maps a tone word on any element to the local tone values
every component consumes. Components consume tones; they never map them.
_Avoid_: variant mapper, theme resolver

**Soft**:
The default appearance of a toned component: a translucent tint of the tone
over whatever background it sits on. The whole surface carries the tint —
never an edge-stripe.
_Avoid_: subtle, ghost, outline, tinted (as a name)

**Solid**:
The opt-in filled appearance: the tone as the fill, its `-content` pair as the
text, gated at 4.5:1 contrast.
_Avoid_: filled, primary (that's the button's job, not the appearance's name)
