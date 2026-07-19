// Copy the built framework and adoption artifacts into public/, so the docs
// site serves them (and llms.txt / skills.sh at its root). Runs before dev and
// build. The framework is built by the root `bun run build` first.
import { cpSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const from = (p) => fileURLToPath(new URL("../" + p, import.meta.url));
const to = (p) => fileURLToPath(new URL("public/" + p, import.meta.url));

if (!existsSync(from("dist/hikarion.min.css"))) {
  console.error("hikarion-site: dist not built — run `bun run build` at the repo root first.");
  process.exit(1);
}

mkdirSync(to("themes"), { recursive: true });
for (const f of ["hikarion.min.css", "hikarion.js"]) cpSync(from("dist/" + f), to(f));
cpSync(from("dist/themes"), to("themes"), { recursive: true });
cpSync(from("dist/llms.txt"), to("llms.txt"));
cpSync(from("dist/hikarion-rules.md"), to("hikarion-rules.md"));
cpSync(from("skills.sh"), to("skills.sh"));

console.log("✓ synced framework + llms.txt + skills.sh → site/public/");
