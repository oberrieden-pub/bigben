# Print

Two formats of the same sign:

- `banner.pdf` - hand this to a print shop, or print it yourself
- `banner.html` - the source of the PDF; prints fine straight from a browser
- `banner.pptx` - the same thing editable: one A4 landscape slide carrying
  both strips, so it is one sheet through the printer and one cut

Keep them in step. All three are generated, with nothing installed in the
repo: the two Node scripts use the machine's global `qrcode` and `pptxgenjs`,
and the PDF script is standard-library Python driving headless Chrome.

    tk node print/make-banner.cjs        # banner.html, from banner.template.html
    py -3.12 print/make-banner-pdf.py    # banner.pdf, from banner.html
    tk node print/make-banner-pptx.cjs   # banner.pptx and the two QR PNGs

The Node scripts replaced `make-banner.py` and `make-banner-pptx.py`, which
needed segno and python-pptx; the rebuilt machine has neither.

The wording lives in `banner.template.html` and `make-banner-pptx.cjs`, so a
copy change means editing both. The PDF comes from headless Chrome rather than
LibreOffice: LibreOffice cannot run on this machine, and it would substitute
fonts anyway. Printing the HTML keeps the pub's own faces and draws the QR as
vector paths rather than a bitmap.

The deck uses Georgia and Trebuchet MS rather than the site's own Bitter and
Cabin. Those are web fonts and are not installed on a normal machine, so naming
them would only produce a silent substitution that looks wrong.

`banner.html` - one A4 **landscape** sheet holding two banner strips, 281 x 92 mm.
Top strip German, bottom strip English, with a plain 8 mm white gap between
them. One cut anywhere in that gap gives one of each.

There is deliberately **no printed cut line**. A dashed line left marks on the
edge of the sign however carefully it was cut. Each strip has its own maroon
border, so the gap is obvious without one.

## Printing it

Open `banner.html` in a browser and print with:

- **Landscape**
- **Background graphics ON** - without this the maroon does not print and you
  get cream text on white paper, i.e. nothing.
- Scale **100%**, not "fit to page".

## Changing it

Edit `banner.template.html`, then:

    tk node print/make-banner.cjs

The fonts are embedded and the QR is inline SVG, so `banner.html` is a single
self-contained file that prints correctly on a machine with no network and none
of the pub's typefaces installed.

## Colour

Light ground, maroon type. The sign goes on a dark wall, so a maroon panel
would sink into it and a cream one reads as a sign hung on it. It also uses a
fraction of the toner.

## The QR codes

Two, side by side: **Review us** points at `https://oberrieden.pub/review`,
and **Follow us** at `https://oberrieden.pub/follow`. Neither goes straight
to Google, Instagram or Facebook. `/review` (`src/pages/review/index.astro`)
redirects to the Google listing; `/follow` (`src/pages/follow/index.astro`)
is a small page offering Instagram or Facebook, so the guest picks. Three
reasons for going through the site:

- it is short enough to print as readable text as well
- a shorter URL is a less dense code, so it scans from further away
- if the Google link or either social account ever changes, `src/data/pub.ts`
  changes and **every printed banner keeps working**

The Follow us code pointed at `/instagram` until the Facebook page went on
the site. `/instagram` still redirects straight to Instagram, so anything
printed with the old code keeps working.

Both codes are version 3 at error level **Q**, which recovers about a quarter
of the code if part of it is scuffed or in shadow. Both addresses fit that size
at Q; a longer address would push the code up a size or down to level M.

Each is 42 mm, maroon on cream, which measures 12.6:1 - well inside what a
phone camera reads. They were one code at 50 mm until the Follow us code was
added. Two at 50 mm leave the text too narrow for the German lines. The deck
script regenerates both PNGs on every run, so they cannot drift from the
addresses. The web address is not a code at all: it is set at 50pt so it can
be read from across the room, which no QR of this size can be.
