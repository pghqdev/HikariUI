// axe-core against kitchen-sink.html. Fails the build on violations.
// Run after build: bun run check:a11y
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
const sink = join(root, "kitchen-sink.html");
const distCss = join(root, "dist/hikarion.css");

if (!existsSync(sink) || !existsSync(distCss)) {
  console.error("✗ kitchen-sink.html and dist/hikarion.css are required (run bun run build)");
  process.exit(1);
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".map": "application/json",
};

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const rel = urlPath === "/" ? "/kitchen-sink.html" : urlPath;
  const filePath = normalize(join(root, rel));
  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream" });
  res.end(readFileSync(filePath));
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = /** @type {import("node:net").AddressInfo} */ (server.address());
const url = `http://127.0.0.1:${port}/kitchen-sink.html`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });

const results = await new AxeBuilder({ page }).analyze();
await context.close();
await browser.close();
server.close();

const violations = results.violations;
if (!violations.length) {
  console.log("✓ axe-core: no violations on kitchen-sink.html");
  process.exit(0);
}

console.error(`✗ axe-core: ${violations.length} violation group(s)`);
for (const v of violations) {
  console.error(`\n${v.id} (${v.impact}): ${v.help}`);
  for (const node of v.nodes.slice(0, 5)) {
    console.error(`  - ${node.target.join(" ")}`);
    if (node.failureSummary) console.error(`    ${node.failureSummary.split("\n")[0]}`);
  }
}
process.exit(1);
