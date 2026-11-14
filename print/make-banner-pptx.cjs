// Builds print/banner.pptx: the wall banner as an editable PowerPoint.
//
// One A4 landscape slide carrying both strips, German above and English
// below, so the whole thing is a single sheet through the printer and one
// cut. Every piece is a real shape and can be dragged, retyped or recoloured.
//
// Fonts are deliberately ones that ship with Office. The site's own faces
// (Bitter, Cabin, Geist) are web fonts, not installed on a normal machine, so
// naming them here would only produce a silent substitution that looks wrong.
// Georgia stands in for Bitter and Trebuchet MS for Cabin.
//
// Run with the globally installed packages, nothing installed locally:
//   tk node print/make-banner-pptx.cjs
// It replaced make-banner-pptx.py (python-pptx and segno), which the rebuilt
// machine no longer had. Never hand-edit banner.pptx: change this and rerun.
const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const QRCode = require("qrcode");
// pptxgenjs carries its own copy of JSZip; used to set the slide size type.
const JSZip = require(path.join(path.dirname(require.resolve("pptxgenjs")), "..", "node_modules", "jszip"));

const ROOT = path.resolve(__dirname, "..");

// Two codes, each through the pub's own short redirect so a changed Google
// link or Instagram handle needs no reprint. The PNGs are regenerated on
// every run, so they cannot drift from these addresses.
const CODES = [
  ["https://oberrieden.pub/review", path.join(ROOT, "print", "qr-review.png")],
  ["https://oberrieden.pub/follow", path.join(ROOT, "print", "qr-follow.png")],
];

const MAROON = "531C23", GOLD = "DDBA7A", PAPER = "FBF7F0", TAN = "8A6239";

const PAGE_W = 297, PAGE_H = 210; // A4 landscape, mm
const SHEET = 8;                  // a printer cannot reach the paper edge
const W = 281, H = 92;            // the finished sign, mm
const BAR = 12;                   // fascia board
const MARGIN = 14;
const QRSIZE = 42;                // two codes; at 50 only one fits beside the text
const QRGAP = 6;
const QRX = W - MARGIN - QRSIZE * 2 - QRGAP; // left edge of the first code
// 8 + 92 = 100, a 10mm gap to cut in, second strip 110 to 202, 8mm at the foot.
const STRIP_Y = [SHEET, 110];

const CONTENT = [
  { quip: "Neue Website. Immer noch das gleiche gute Bier.",
    ask: ["Hat es Ihnen gefallen? Sagen Sie es Google.", "Wenn nicht, dem Wirt."],
    caps: ["BEWERTEN SIE UNS", "FOLGEN SIE UNS"] },
  { quip: "New website. Still the same great beer.",
    ask: ["Enjoyed it? Tell Google.", "If not, tell the landlord."],
    caps: ["REVIEW US", "FOLLOW US"] },
];

const NOTES =
  "One A4 landscape sheet, two strips, one cut. Finished size 281 x 92 mm each. " +
  "Print at 100% scale with background graphics switched on, or the maroon bar " +
  "will not appear. There is no printed cut line: cut anywhere in the white gap " +
  "between the strips.\n\n" +
  "The left code points at oberrieden.pub/review, which redirects to the pub's " +
  "Google listing; the right one at oberrieden.pub/follow, a page offering Instagram or Facebook. If either account " +
  "ever changes, the site is what changes - the codes stay valid, so printed " +
  "copies keep working.";

const mm = (v) => v / 25.4; // pptxgenjs works in inches

function text(slide, x, y, w, h, body, o) {
  const lines = Array.isArray(body) ? body : [body];
  const runs = lines.map((t, i) => ({ text: t, options: { breakLine: i < lines.length - 1 } }));
  slide.addText(runs, {
    x: mm(x), y: mm(y), w: mm(w), h: mm(h),
    fontFace: o.font, fontSize: o.size, color: o.colour, bold: !!o.bold,
    charSpacing: o.spacing, align: o.align || "left", valign: o.anchor || "top",
    // PowerPoint pads text boxes by default, which would push everything a
    // couple of millimetres off the alignment the shapes establish.
    margin: 0, wrap: true, fit: "none",
  });
}

function rect(slide, pres, x, y, w, h, fill, line) {
  slide.addShape(pres.ShapeType.rect, {
    x: mm(x), y: mm(y), w: mm(w), h: mm(h),
    fill: { color: fill },
    line: line ? { color: line, width: 1 } : { type: "none" },
  });
}

function strip(slide, pres, oy, c) {
  const ox = SHEET;
  // The edge of the sign, so it reads as an object hung on a dark wall, and
  // so it is clear where to cut.
  rect(slide, pres, ox, oy, W, H, PAPER, MAROON);
  // The fascia board.
  rect(slide, pres, ox, oy, W, BAR, MAROON);

  text(slide, ox + MARGIN, oy, W - MARGIN * 2, BAR, "BIG BEN PUB  ·  OBERRIEDEN DORF",
    { font: "Trebuchet MS", size: 11.5, colour: GOLD, bold: true, spacing: 3, anchor: "middle" });
  text(slide, ox + MARGIN, oy + 24, QRX - MARGIN - 6, 20, "oberrieden.pub",
    { font: "Georgia", size: 50, colour: MAROON, bold: true });
  text(slide, ox + MARGIN, oy + 45.5, QRX - MARGIN - 6, 8, c.quip,
    { font: "Georgia", size: 18, colour: TAN, bold: true });
  text(slide, ox + MARGIN, oy + 55, QRX - MARGIN - 6, 13, c.ask,
    { font: "Calibri", size: 14, colour: MAROON });

  CODES.forEach(([, png], i) => {
    const x = ox + QRX + i * (QRSIZE + QRGAP);
    slide.addImage({ path: png, x: mm(x), y: mm(oy + 25), w: mm(QRSIZE), h: mm(QRSIZE) });
    text(slide, x - 3, oy + 69, QRSIZE + 6, 6, c.caps[i],
      { font: "Trebuchet MS", size: 10, colour: MAROON, bold: true, spacing: 1.5, align: "center" });
  });
}

(async () => {
  for (const [url, png] of CODES) {
    // 29 modules plus a 2-module border, at 36 px: the 1188 px image the
    // codes have always had.
    await QRCode.toFile(png, url, {
      type: "png", errorCorrectionLevel: "Q", margin: 2, scale: 36,
      color: { dark: "#531C23FF", light: "#FBF7F0FF" },
    });
  }

  const pres = new PptxGenJS();
  pres.defineLayout({ name: "A4L", width: mm(PAGE_W), height: mm(PAGE_H) });
  pres.layout = "A4L";
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  STRIP_Y.forEach((oy, i) => strip(slide, pres, oy, CONTENT[i]));
  slide.addNotes(NOTES);

  // The dimensions alone leave PowerPoint reporting "Custom". The sldSz type
  // attribute is what makes the Slide Size dialog say A4, which is what the
  // person printing it needs to see.
  const zip = await JSZip.loadAsync(await pres.write({ outputType: "nodebuffer" }));
  const p = "ppt/presentation.xml";
  let xml = await zip.file(p).async("string");
  xml = xml.replace(/<p:sldSz([^>]*?)\s*\/>/, (m, attrs) =>
    `<p:sldSz${attrs.replace(/\s+type="[^"]*"/, "")} type="A4"/>`);
  zip.file(p, xml);

  // BANNER_PPTX lets a check run write somewhere else, so the real file is not
  // clobbered while it is open in PowerPoint.
  const out = process.env.BANNER_PPTX || path.join(ROOT, "print", "banner.pptx");
  fs.writeFileSync(out, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  console.log(`wrote ${out}  (${Math.floor(fs.statSync(out).size / 1024)} KB)`);
})();
