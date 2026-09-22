/* Tells IndexNow that pages have changed.
 *
 * IndexNow is a ping, not an index: you hand it a list of URLs and the search
 * engines that take part come and look. Bing, Yandex, Seznam and Naver do -
 * which reaches DuckDuckGo and Ecosia through Bing. **Google does not take
 * part**, so this does nothing for the search results that matter most here.
 * Google gets the sitemap and Search Console instead.
 *
 * The URLs come from the sitemap the build has just written, so a page that is
 * noindexed is never submitted - sitemap.mjs has already dropped it, and
 * telling a search engine to look at a page you asked it to ignore is the kind
 * of contradiction Search Console reports back at you.
 *
 * It does NOT send by default. Run it to see what would go:
 *
 *     node scripts/indexnow.mjs
 *
 * and add --send when you actually want the ping to leave:
 *
 *     node scripts/indexnow.mjs --send
 *
 * Deliberately not part of postbuild. Every deploy would ping whether anything
 * changed or not, which is what gets a key ignored for spamming.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const SITE = "https://oberrieden.pub";
const HOST = "oberrieden.pub";
const ENDPOINT = "https://api.indexnow.org/indexnow";

/* The key is public by design: the file proves to the search engine that
   whoever is submitting controls the site. Read it rather than hard-code it,
   so the two can never disagree. */
const keyFiles = (await readdir("public")).filter((f) => /^[0-9a-f]{8,128}\.txt$/.test(f));
if (keyFiles.length !== 1) {
  console.error(
    keyFiles.length === 0
      ? "No IndexNow key file in public/. Expected one <key>.txt."
      : `Expected one IndexNow key file in public/, found ${keyFiles.length}: ${keyFiles.join(", ")}`,
  );
  process.exit(1);
}
const key = keyFiles[0].replace(/\.txt$/, "");
const onDisk = (await readFile(join("public", keyFiles[0]), "utf8")).trim();
if (onDisk !== key) {
  console.error(`The key file must contain exactly its own name. ${keyFiles[0]} contains "${onDisk}".`);
  process.exit(1);
}

let xml;
try {
  xml = await readFile(join("dist", "sitemap.xml"), "utf8");
} catch {
  console.error("No dist/sitemap.xml - run `npm run build` first.");
  process.exit(1);
}
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) {
  console.error("The sitemap has no URLs in it.");
  process.exit(1);
}

const body = { host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList };
const send = process.argv.includes("--send");

console.log(`key          ${key}`);
console.log(`keyLocation  ${body.keyLocation}`);
console.log(`urls         ${urlList.length}`);
urlList.forEach((u) => console.log(`             ${u}`));

if (!send) {
  console.log("\nDry run. Nothing sent. Add --send to submit.");
  process.exit(0);
}

/* Check the key is actually reachable before submitting: a 404 here is the
   usual reason a submission is accepted and then quietly ignored. */
const probe = await fetch(body.keyLocation).catch(() => null);
if (!probe || !probe.ok || (await probe.text()).trim() !== key) {
  console.error(
    `\n${body.keyLocation} does not serve the key yet.` +
      "\nDeploy first - the search engine fetches it to verify the submission.",
  );
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
console.log(`\n${res.status} ${res.statusText}`);
console.log(
  {
    200: "Accepted.",
    202: "Accepted; the key is still being validated.",
    400: "Bad request - check the payload.",
    403: "The key was rejected. Is the key file deployed and served as text?",
    422: "A URL does not belong to this host, or the key does not match.",
    429: "Too many submissions. Leave it.",
  }[res.status] ?? "Unexpected reply.",
);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
