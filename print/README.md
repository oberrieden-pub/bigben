# Print

Two formats of the same sign:

- `banner.html` - finished, print straight from a browser
- `banner.pptx` - the same thing editable: one A4 landscape slide carrying
  both strips, so it is one sheet through the printer and one cut

Keep them in step: both are generated, `make-banner.py` for the HTML and
`make-banner-pptx.py` for the deck, and the wording lives in both scripts.

The deck uses Georgia and Trebuchet MS rather than the site's own Bitter and
Cabin. Those are web fonts and are not installed on a normal machine, so naming
them would only produce a silent substitution that looks wrong.

`banner.html` — one A4 **landscape** sheet holding two banner strips, 281 x 92 mm.
Top strip German, bottom strip English. One cut across the middle gives one of each.

## Printing it

Open `banner.html` in a browser and print with:

- **Landscape**
- **Background graphics ON** — without this the maroon does not print and you
  get cream text on white paper, i.e. nothing.
- Scale **100%**, not "fit to page".

## Changing it

Edit `banner.template.html`, then:

    python print/make-banner.py

The fonts are embedded and the QR is inline SVG, so `banner.html` is a single
self-contained file that prints correctly on a machine with no network and none
of the pub's typefaces installed.

## Colour

Light ground, maroon type. The sign goes on a dark wall, so a maroon panel
would sink into it and a cream one reads as a sign hung on it. It also uses a
fraction of the toner.

## The QR code

One, for the review. It points at `https://oberrieden.pub/review`, not straight
at Google. That page
(`src/pages/review/index.astro`) redirects. Three reasons:

- it is short enough to print as readable text as well
- a shorter URL is a less dense code, so it scans from further away
- if the Google link ever changes, that one file changes and **every printed
  banner keeps working**

It is 50 mm, maroon on cream, which measures 12.6:1 - well inside what a phone
camera reads. The web address is not a code at all: it is set at 50pt so it can
be read from across the room, which no QR of this size can be.

## Before it goes up

The banner advertises `oberrieden.pub`, which is still `noindex` and awaiting
the owner's approval. Do not put it on the wall before the site goes live.
