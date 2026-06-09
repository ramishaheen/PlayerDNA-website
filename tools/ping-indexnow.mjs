// Ping IndexNow (Bing, Yandex, Seznam, Naver, Yep) with the site's sitemap URLs.
// Run after a deploy:  node tools/ping-indexnow.mjs
// One-liner deploy+ping:  vercel --prod --yes && node tools/ping-indexnow.mjs
// Note: Google does NOT use IndexNow — for Google, submit the sitemap in
// Search Console (Sitemaps) and use URL Inspection -> Request Indexing.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KEY = "0ec3c3a87889ba656f3a2c6d46805e7d"; // public ownership key (also at /<KEY>.txt)
const HOST = "www.playerdna.tech";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

if (!urlList.length) {
  console.error("No <loc> URLs found in sitemap.xml");
  process.exit(1);
}

const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList };

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

console.log(`IndexNow: HTTP ${res.status} — submitted ${urlList.length} URL(s):`);
urlList.forEach((u) => console.log("  " + u));
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}
console.log("Done (202/200 = accepted).");
