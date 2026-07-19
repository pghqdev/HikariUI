# Chips carry selection state, not tone

When the tone grammar (`data-variant="<tone> [solid]"`) was unified across
alert, toast, badge, and button, chip was deliberately excluded. A chip's tint
expresses selection (`aria-pressed`), and letting it also carry a semantic tone
invites incoherent combinations ("selected danger chip"). If a pill needs a
status color, that's a badge. Don't re-propose toned chips without a concrete
use case that selection + badge can't cover.
