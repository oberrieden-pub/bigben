// Builds print/banner.html: one A4 landscape sheet holding two banner strips,
// 281 x 92 mm, German above and English below.
//
// Self-contained on purpose. The fonts are embedded and the QR codes are
// inline SVG, so the landlord can open the file on any machine, print it, and
// get the pub's own typefaces and a scannable code with no network connection.
//
// Run with the globally installed qrcode package, nothing installed locally:
//   tk node print/make-banner.cjs
// It replaced make-banner.py (segno), which the rebuilt machine no longer had.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const ROOT = path.resolve(__dirname, "..");
const FONTS = path.join(ROOT, "public", "fonts");

// Each code points at a short page on the pub's own site, not straight at
// Google, Instagram or Facebook. Printable as text, a less dense code that scans from further
// away, and if a target ever changes only that page changes -
// nothing has to be reprinted.
const REVIEW = "https://oberrieden.pub/review";
const FOLLOW = "https://oberrieden.pub/follow";

const font = (name) => fs.readFileSync(path.join(FONTS, name)).toString("base64");

// Inline SVG that scales to whatever the tile gives it. Error level Q
// survives a bit of pub wall; a quiet zone of 2 modules is the minimum a
// phone camera reliably locks onto. Maroon on a transparent ground, so the
// strip's cream shows through: 12.6:1, which any phone reads.
async function qr(data) {
  const svg = await QRCode.toString(data, {
    type: "svg", errorCorrectionLevel: "Q", margin: 2,
    color: { dark: "#531C23", light: "#0000" },
  });
  // qrcode gives a viewBox and no width or height, so CSS sizes it; drop the
  // empty background path that the transparent light colour leaves.
  return svg.replace(/<path fill="#0000"[^>]*\/>/, "").trim();
}

(async () => {
  let html = fs.readFileSync(path.join(ROOT, "print", "banner.template.html"), "utf8");
  const tokens = [
    ["__CABIN__", font("cabin-600-latin.woff2")],
    ["__BITTER__", font("bitter-700-latin.woff2")],
    ["__GEIST6__", font("geist-600-latin.woff2")],
    ["__QR_REVIEW__", await qr(REVIEW)],
    ["__QR_FOLLOW__", await qr(FOLLOW)],
  ];
  for (const [token, value] of tokens) {
    if (!html.includes(token)) throw new Error("template has no " + token);
    html = html.split(token).join(value);
  }
  const out = path.join(ROOT, "print", "banner.html");
  fs.writeFileSync(out, html);
  console.log(`wrote ${out}  (${Math.floor(fs.statSync(out).size / 1024)} KB)`);
})();
