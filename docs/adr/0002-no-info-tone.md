# Tone names mirror token names — there is no `info` tone

Tones are `accent | success | warning | danger`, exactly the Tier-1 color
tokens. Alert originally exposed an `info` variant that silently mapped to
`--accent`; it was renamed. A semantic `info` name either hides that mapping or
pressures Tier-1 to grow an `--info`/`--info-content` pair later. The grammar
being a direct window onto the token seam beats the conventional word. Don't
reintroduce `info` as an alias — one name per concept.
