#!/bin/sh
# Install the Hikarion UI Skill for Claude Code, so an agent doing UI work inherits
# Hikarion's rules instead of freestyling. Usage:
#   curl -fsSL https://raw.githubusercontent.com/pghqdev/HikarionUI/main/skills.sh | sh
#   curl -fsSL https://raw.githubusercontent.com/pghqdev/HikarionUI/main/skills.sh | sh -s -- --global
# (project scope ./.claude by default; --global installs to ~/.claude)
#
# The skill body is the canonical rules file, fetched live — same source as
# llms.txt and AGENTS.md, so it never drifts. Override the source for testing:
#   HIKARION_RULES_URL=./rules/hikarion-rules.md sh skills.sh
set -eu

RULES_URL="${HIKARION_RULES_URL:-https://raw.githubusercontent.com/pghqdev/HikarionUI/main/rules/hikarion-rules.md}"

case "${1:-}" in
  --global) BASE="$HOME/.claude" ;;
  *)        BASE=".claude" ;;
esac
DIR="$BASE/skills/hikarion-ui"

# Fetch the rules — from a local path if given, else over HTTP.
if [ -f "$RULES_URL" ]; then
  RULES="$(cat "$RULES_URL")"
elif command -v curl >/dev/null 2>&1; then
  RULES="$(curl -fsSL "$RULES_URL")"
elif command -v wget >/dev/null 2>&1; then
  RULES="$(wget -qO- "$RULES_URL")"
else
  echo "hikarion: need curl or wget to fetch $RULES_URL" >&2
  exit 1
fi

[ -n "$RULES" ] || { echo "hikarion: fetched empty rules from $RULES_URL" >&2; exit 1; }

mkdir -p "$DIR"
{
  cat <<'FRONTMATTER'
---
name: hikarion-ui
description: Rules for writing UI with Hikarion UI, the class-light CSS framework for semantic HTML. Use whenever building or editing a web page, component, form, dialog, or any HTML/CSS — write bare semantic tags plus Hikarion's data-* vocabulary instead of freestyling utility classes (Tailwind/Bootstrap). Triggers on UI/frontend/styling work in a repo that uses Hikarion.
---

FRONTMATTER
  printf '%s\n' "$RULES"
} > "$DIR/SKILL.md"

echo "hikarion: installed Skill → $DIR/SKILL.md"
