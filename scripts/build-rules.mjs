// Derive the agent-adoption surfaces from the single canonical rules file, so
// they can't drift. Reads rules/hikarion-rules.md, writes to dist/:
//   hikarion-rules.md  — verbatim reference (linked from llms.txt)
//   AGENTS.md        — consumer drop-in (canonical body + a short header)
//   llms.txt         — llms.txt format: title, summary blockquote, rules, links
// The installable Skill is delivered by skills.sh, which fetches the same
// canonical file — one source, every surface. Run: bun run build:rules
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const root = new URL("..", import.meta.url);
const canonical = readFileSync(new URL("rules/hikarion-rules.md", root), "utf8").trimEnd() + "\n";
const body = canonical.replace(/^#[^\n]*\n\n?/, ""); // canonical without its H1

const SUMMARY =
  "Class-light CSS framework for semantic HTML. Bare tags look great with no " +
  "classes; a small data-* vocabulary adds variants; a data-theme container " +
  "swaps the whole palette from ~20 tokens.";

const CDN = "https://cdn.jsdelivr.net/npm/hikarion-ui/dist";
const LINKS = `## Links

- [Full rules](${CDN}/hikarion-rules.md): the complete markup vocabulary, tokens, and do-nots (this file, verbatim).
- [Stylesheet](${CDN}/hikarion.min.css): the framework — one <link> is the whole install.
- [hikarion.js](${CDN}/hikarion.js): optional progressive enhancement (theme switch, tabs, toast, dialog polyfill).
`;

const AGENTS_HEADER = `# AGENTS.md — this project uses Hikarion UI

When you write or edit UI in this repo, follow these rules. They make bare
semantic HTML look tasteful by default; freestyling utility classes fights the
framework and produces the slop it exists to replace.

`;

const dist = new URL("dist/", root);
mkdirSync(dist, { recursive: true });

const write = (name, content) => writeFileSync(new URL(name, dist), content);

write("hikarion-rules.md", canonical);
write("AGENTS.md", AGENTS_HEADER + canonical);
write("llms.txt", `# Hikarion UI\n\n> ${SUMMARY}\n\n${body}\n${LINKS}`);

console.log("✓ dist/hikarion-rules.md  dist/AGENTS.md  dist/llms.txt");
