# Print

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

## The QR codes

Two: the site, and the review link. The review one points at
`https://oberrieden.pub/review`, not straight at Google. That page
(`src/pages/review/index.astro`) redirects. Three reasons:

- it is short enough to print as readable text as well
- a shorter URL is a less dense code, so it scans from further away
- if the Google link ever changes, that one file changes and **every printed
  banner keeps working**

Both are 38 mm, maroon on cream, which measures 12.6:1 - well inside what a
phone camera reads. That size is comfortable at arm's length, which suits a
spot by the door or on the bar. It is not a code to be scanned from across the
room; the printed address is there for that.

## Before it goes up

The banner advertises `oberrieden.pub`, which is still `noindex` and awaiting
the owner's approval. Do not put it on the wall before the site goes live.
