/* Post-build sanity check on the generated HTML.
 *
 * Exists because of a bug that bit four times: when a line in an .astro file
 * wraps immediately before or after an inline tag, the newline is collapsed and
 * the space goes with it. "und ab Thalwil" ships as "und abThalwil". The source
 * looks perfectly correct; only the output is wrong, so nobody notices.
 *
 * Runs as npm's postbuild, so it fails a local build and a GitHub Actions
 * deploy alike. Fix the source with {" "} at the boundary, not by reflowing the
 * line, which will only wrap again the next time someone edits the sentence.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const INLINE = "strong|a|em|b|i|span|abbr|s|del";

const CHECKS = [
  {
    name: "space lost after an inline tag",
    // </strong>Thalwil  — two or more letters, so "</a>s" and punctuation pass
    re: new RegExp(`</(?:${INLINE})>(?=[A-Za-zÀ-ÿ]{2,})`, "g"),
  },
  {
    name: "space lost before an inline tag",
    // ab<strong>  — a letter or full stop butting straight against the tag
    re: new RegExp(`(?<=[A-Za-zÀ-ÿ.])<(?:${INLINE})[\\s>]`, "g"),
  },
  {
    name: "HTML comment shipped to visitors",
    // Astro strips {/* ... */} but sends <!-- ... --> to every reader
    re: /<!--(?!\[if)/g,
  },
];

function context(html, index) {
  const from = Math.max(0, index - 45);
  const to = Math.min(html.length, index + 45);
  return html.slice(from, to).replace(/\s+/g, " ").trim();
}

const files = (await readdir(DIST, { recursive: true })).filter((f) =>
  f.endsWith(".html"),
);

let failures = 0;
for (const file of files) {
  const html = await readFile(join(DIST, file), "utf8");
  for (const check of CHECKS) {
    for (const m of html.matchAll(check.re)) {
      failures++;
      console.error(`  ${file}: ${check.name}`);
      console.error(`    …${context(html, m.index)}…`);
    }
  }
}

if (failures) {
  console.error(`\ncheck-html: ${failures} problem(s) in ${files.length} pages`);
  process.exit(1);
}
console.log(`check-html: ${files.length} pages clean`);
