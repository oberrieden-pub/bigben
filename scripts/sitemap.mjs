/* Writes dist/sitemap.xml after a build.
 *
 * Generated rather than hand-written for the same reason the hours are: a
 * static list goes stale the moment someone adds a page, and nobody would
 * notice. This reads whatever the build actually produced.
 *
 * Pages carrying a noindex meta are skipped, so /review - which only exists to
 * redirect to Google - stays out of it. A sitemap that lists a page you have
 * told search engines to ignore is a contradiction Search Console reports back
 * at you as an error.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const SITE = "https://oberrieden.pub";

const files = (await readdir(DIST, { recursive: true })).filter((f) =>
  f.endsWith(".html"),
);

const urls = [];
for (const file of files.sort()) {
  const html = await readFile(join(DIST, file), "utf8");
  if (/name="robots"[^>]*content="[^"]*noindex/i.test(html)) continue;
  // The front page is served at the bare domain, not at /index.html.
  const path = file === "index.html" ? "/" : "/" + file.replace(/\\/g, "/");
  urls.push(SITE + path);
}

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${u}</loc></url>\n`).join("") +
  "</urlset>\n";

await writeFile(join(DIST, "sitemap.xml"), xml, "utf8");
console.log(`sitemap: ${urls.length} page(s)`);
