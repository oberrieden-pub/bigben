# AGENTS.md — working on this repository

`README.md` is the orientation: what the site is, where things live, what is
still open. This file is the other half — the decisions that look arbitrary
until you know why, and the traps that have already caught someone.

Read it before changing anything. Most of what follows exists because the
obvious change is the wrong one.

## The rule the whole site is built around

**Publish changing information only in channels that expire it themselves.**

Google Business Profile posts vanish after seven days, Instagram stories after
twenty-four hours. A web page deletes nothing. A landlord who stops updating a
page leaves one that is visibly, permanently wrong — which is how the previous
site died, and the abandoned domain is still up serving an injected online
casino advertorial inside its About section.

So the site carries **no fixture list and no event listings**. Only standing
statements and links out. A fixtures calendar button was built once and removed
for pointing at a calendar that did not exist.

If you are asked to "just add the fixtures", that request undoes the design.
Raise it first. The counter-argument you will hear is that Paddy Reilly's in
Zurich manages a weekly fixture list — true, and they employ someone across a
three-pub group to do it. This pub's entire web budget is the domain, about
CHF 25 a year.

Note also what that page cannot tell you: their fixtures carry no month and no
year, so it will look current forever once nobody updates it. Kennedy's, on a
2018 copyright, is what that looks like three years later.

## Facts live in one place

`src/data/pub.ts` is the single source of truth. Hours used to live in three
places and had to be changed in all of them.

`hours` is an array of minutes-from-midnight indexed by JavaScript day number,
read at build time by three components:

- `Hours.astro` — the visible table, one row per day, Monday first
- `StatusPill.astro` — the open/closed line, computed in the browser from the
  same array so it is right in any timezone
- `SchemaOrg.astro` — the structured data

Change the array and all three follow. **But** `StatusPill` also carries a
static prose fallback for when its script does not run, and prose does not
follow anything. When Saturday moved to 13:30 that fallback still read
"Tuesday to Saturday from 17:00". Check it.

Nothing on the site calls Google at runtime. There is no `fetch`, no API key,
no token anywhere. The hours are static and *can* drift from the Business
Profile; `README.md` explains why syncing them is not worth it.

## German is localised, not translated

The client asked for this explicitly. The German pages are for a Swiss
audience:

- No eszett anywhere — `Fuss`, `draussen`, `Strasse`
- Guillemets `«»`, not quotation marks
- Swiss vocabulary over the German: `Reservationen`, `Parkieren`, `Trottoir`,
  `nachführen`, `Offene Weine`, `Billett`, `Entscheid`
- Where an English joke has no German equivalent, the German gets **its own
  joke** rather than a translation. The soft-drinks aside is
  `selbstverständlich`; the English is "with ice and a slice (optional)". They
  are not meant to match.

Do not "fix" those into parallel. Watch for the opposite failure too — the
German drifting from its own conventions. One pass found named entities
(`&ouml;`) beside real umlauts, `2 Minuten` beside `zwei Minuten`, `Livesport`
beside `Live-Musik`, and a deliberate English "only a few metres" that had lost
its `nur`.

## The Google reviews describe two different pubs

The company was registered in February 2024. Reviews older than that are about
the **previous** operation, and Google does not distinguish them: as of
September 2026 the listing's own keyword chips advertise a **pulled pork
sandwich** (8 mentions) and a **hot dog** (2), neither of which the pub has
served since the change of landlord. Nothing from the previous menu survives.

So do not mine the Google reviews, the keyword chips or the Menu tab for what
the pub sells. The menu in `src/pages/index.astro` is what the current landlord
confirmed, and it is short on purpose. If a future pass "notices" that Google
says there is a pulled pork sandwich, that is this trap, not a gap.

The same applies to "friendly owner" and "friendly landlord" in those chips.
They may well be about somebody else.

It also explains why the printed banner asks for reviews. The chips are
weighted toward recent ones, so new reviews are the only thing that moves the
listing's description of the pub toward the pub that exists. That is a content
problem, not a ratings one - the 4.7 was never the issue.

## Every section has an anchor

`#sport` `#hours` `#menu` `#darts` `#music` `#pub` `#bookings` `#find` - the
same ids on both language pages, so a link works whichever it points at. The
ids are English words on the German page too: they are addresses, not copy.

They exist so the outside channels can deep-link a section. The Google
listing's Menu tab points at `oberrieden.pub#menu` rather than the top of the
page. `.band[id]` carries a small `scroll-margin-top` so a heading lands
slightly below the viewport edge rather than flush against it.

The topbar carries a **section menu**, added on 23 September 2026 once the
page had grown to eight sections and the only way back to the top was to
scroll. It is deliberately the only navigation on the site: a hamburger in the
topbar, no inline jump links in the body, which the client has turned down
twice.

It lives in `SectionNav.astro`. It is a `<details>` disclosure, not a button
plus JavaScript, so it opens,
closes and takes the keyboard with none. The script in `Base.astro` only adds
the conveniences - close after a jump, on Escape, on a click outside - and the
menu still works with every line of it removed.

**Switching language keeps your place.** If you are in a section and switch,
you land in the same section on the other language page. This works only
because the ids are identical on both pages, which is the reason they are
English words on the German page.

The section is read from **scroll position, not `location.hash`** - you have
usually scrolled to a section rather than clicked to it, and the hash would
still point at wherever you last clicked, or at nothing.

It is read against the section's own **`scroll-margin-top`**, not against the
topbar height. This is the off-by-one that shipped first: a jumped-to section
comes to rest at its scroll-margin (83px), which is *below* a line drawn at
the topbar's height, so the section you had just jumped to did not count as
current and the switch sent you to the one before it. Reading the margin off
the element keeps the test in step with the CSS if the token ever changes. All four switches
(topbar chip, footer link, and both halves of the menu toggle) carry
`data-langswitch`; the script in `Base.astro` rewrites the href on click. With
the script gone the links still work, they just land at the top.

**Two traps in it.**

`--topbar-h` in `site.css` must match the real height of the sticky topbar,
because `.band[id]` adds it to `scroll-margin-top` so a jumped-to heading
clears the bar instead of hiding under it. It is measured, not guessed: 68.19px
at both 375px and desktop, so the token is 69px. Change the topbar's padding or
the wordmark's size and this has to be re-measured.

The links are **bare `#id` on the front pages and `index.html#id` everywhere
else**, computed as `navBase` in `Base.astro`. A full path on the front page
itself reloads the whole page instead of jumping within it, which is how it was
first built and why it is worth leaving alone.

## Two photo components, for different jobs

`Gallery.astro` is a strip you scroll: uniform height, natural widths, many
pictures. `Carousel.astro` shows **one at a time and advances itself**, and is
reusable - drop in as many as you like. The script in `Base.astro` walks every
`[data-carousel]` and gives each its own timer and state.

    <Carousel label="Live music" items={photos}
              ratio="4/3" interval={7000} glide={1300} lang="de" />

`ratio` (default `1/1`) sets a `--slide-ratio` custom property the CSS reads.
Every slide in one carousel shares that frame on purpose: mixed shapes make
the box change height as it runs, which shoves the page around under the
reader. `interval` (default 7500ms) drives the timer **and** the progress
fill from one value, so the bar always matches the real delay.

`effect` is **`fade` by default**: the pictures cross over in place. A sideways
`slide` is available and was the first version, but travel at this size reads
as a jolt however long you make it - fading is calmer. `glide` (default 1300ms)
is how long either takes.

The fade styles all hang off an `.is-fade` class that **only the script adds**.
That is deliberate: with no JavaScript the track has to stay a scrollable
strip, because nothing would be left to change the slide. Never move those
styles onto `.carousel` itself.

The markup is a scroll-snap track, not a bespoke slider, so with the script
removed it is still a swipeable strip of pictures - it just stops advancing.

**Auto-advancing content has duties, and they are already wired.** There is a
real pause button, because WCAG 2.2.2 requires one for anything moving for
more than five seconds. It never starts under `prefers-reduced-motion`, stops
on hover and on keyboard focus, and idles while scrolled off screen. If you
reuse this, do not strip those out.

**A hidden tab throttles `requestAnimationFrame` but not `setInterval`.** The
sliding version moved the track on a rAF tween, so on a hidden tab the dots
marched on while the picture stayed put. There is a `visibilitychange` guard
for it. Anything you add that animates on a timer needs the same.

**The trap that cost the most here:** Astro writes `width`/`height`
attributes on every `<img>`, and `aspect-ratio` only sizes an element whose
height is `auto`. Omit `height:auto` and the attribute wins, every slide
renders at full natural height, and the section measured 2671px instead of
659. Every photo rule in `site.css` pairs `width:100%` with `height:auto` for
this reason.

## Traps that have already caught someone

**`index.astro` and `de.astro` use `
`, not CRLF.** A doubled carriage
return before every newline, present since the first commit. The build does
not care, but any edit that matches on multi-line text will silently fail to
find its anchor - it has cost two sessions already. Read the file as bytes and
detect the separator before matching, or edit single lines only. `site.css`,
`Base.astro` and the Markdown files are ordinary CRLF; do not assume either
way, check.

**The lightbox groups photographs by their track.** `groupFor()` looks for the
nearest `.scroller` (Gallery) **or** `.ctrack` (Carousel) to decide what the
arrows step through. A photo component with a new wrapper class falls through
to a group of one: the viewer reads "1 of 1" and the arrows do nothing, which
looks like a broken lightbox rather than a missing selector.

**Grid items do not shrink below their content.** `min-width:auto` is the
default, so a column holding a wide scroller demands that width and starves
its neighbour - the darts board photo was squeezed to 54px this way. Hence
`.cols>*{min-width:0}`. If a two-column section ever collapses oddly, look
here first.

**`footer` is declared twice in `site.css`**, and the later rule wins. That is
how `.subhead` kept a brown ground for weeks after the topbar and footer moved
to the signboard maroon: the fix was bolted on late in the file rather than
applied at the declaration, so the third element was missed. Fix colours where
they are declared.

**Astro eats a space at a line wrap.** When a line in a `.astro` file wraps
immediately before or after an inline tag, the newline collapses and the space
goes with it: `und ab Thalwil` ships as `und abThalwil`. The source looks
correct; only the output is wrong. Fix it with `{" "}` at the boundary, never
by reflowing the line — it will wrap again the next time anyone edits the
sentence.

This bug shipped four times, which is why `scripts/check-html.mjs` runs as
npm's `postbuild` and fails the build. It also catches HTML comments reaching
visitors: use `{/* */}` in `.astro` files, because `<!-- -->` is sent to every
reader.

**Google Maps `data=` payloads are counted.** `!4m7` declares seven following
elements. Taking a working URL and deleting a flag off the end leaves a count
that no longer matches, and Google will not open it. That is exactly how the
"Google page" link broke. Use the `cid` form — `maps.google.com/?cid=<decimal>`
— which has no payload to get wrong.

**Changing the Pages custom domain through the API makes GitHub commit to the
repository itself** (Delete CNAME / Create CNAME), so your next push is
rejected as non-fast-forward. Rebase onto it. Never force. A repository
transfer, by contrast, carries Pages and the domain across with no outage.

**Astro 7 rejects Node 20.** CI pins `node-version: 22`.

**`build.format: "file"`** emits `de.html` rather than `de/index.html`. GitHub
Pages resolves extensionless URLs, so `/review` reaches `review.html`.

## The design tokens worth knowing

`--r-sm` (4px) and `--r-md` (6px) are the corner radii: controls and cards.
They were 8 and 12 until 23 September 2026. **`--r-pill` no longer exists** -
the chips and the status pill are square-cornered like everything else, and a
token by that name holding a small value would have misled whoever read it
next. Do not reintroduce it; use `--r-sm`.

`--ctl-h` (44px) is one height for every control in the topbar, so the menu
button and the two chips line up and are equally easy to hit. The chips get
that height from the tap-target padding block further down the file.

`--topbar-h` (69px) must match the real topbar height - see the section menu
above. It is measured, not guessed.

## Photographs

`src/assets/photos/` holds the originals; Astro generates the responsive AVIF
derivatives. Rules learned the hard way:

- **Strip EXIF, but transpose first.** Stripping metadata without
  `ImageOps.exif_transpose()` laid three photos on their side.
- Exclude anyone identifiable without consent. The live-music set is in use
  because the owner confirmed it.
- Watch for Samsung's burnt-in "AI-generated content" label. One supplied shot
  had a concrete wall rendered smooth and white, which is not what a customer
  would find.
- `object-position` only helps where the element actually crops. The darts
  photo is portrait in a landscape box, so `object-fit: cover` scales by width
  and the whole image width is always visible — centring the board meant
  re-cropping the file.

## Accessibility is not decoration here

Contrast has been measured, not eyeballed, and several values sit close to the
threshold on purpose. If you change a colour, measure it again.

- Struck-through or hidden text is not announced by screen readers. If
  something carries meaning visually, it needs it in the markup too.
- The lightbox releases its scroll lock on **every** path, including an
  explicit Escape handler. An earlier version relied on the `close` event,
  which did not always fire, and left the page permanently unscrollable —
  worse than the bug it fixed.
- `p { text-wrap: pretty }` stops paragraphs ending on a single word. Headings
  use `balance`. Where a one-word line is the joke — "Honest!" — it is forced
  with an explicit `<br />` rather than left to the wrapping, so it lands at
  every width.

## Do not add third-party loads to the front page

`legal.astro` / `impressum.astro` state that Google Maps loads **on the Getting
here page only**, and that no other page loads anything from a third party.
That is a factual claim on a page with legal weight. If you embed anything
anywhere else, the privacy page has to change in the same commit.

## Things that are held deliberately

- **The site is live.** It went live on 20 September 2026 and `noindex` is now
  off by default in `Base.astro`. Only `/review` keeps it, because it exists
  solely to redirect to Google. Do not reintroduce a site-wide `noindex`.
- **No booking form. The landlord wants people to phone.** This is his decision,
  taken on 21 September 2026, not a gap in the build. Every comparable pub site
  has some form of online booking and ours deliberately does not — so if a
  future pass benchmarks the competition, notices the omission and offers to
  "fix" it, this is the answer. A form would also mean a third-party endpoint on
  the front page, which contradicts the privacy statement in `legal.astro`.
- **No mailing list either**, for the same reason the site carries no events:
  somebody has to write it, and nobody will.
- **Accounts must not depend on any individual.** The domain, the repository
  and the Google profile belong to the landlord. That is the brief's central
  requirement, not an accident. As of 21 September 2026 each of Google Business
  Profile, Cloudflare, GitHub and Meta has the landlord as owner **and** a
  second administrator, so no single password locks anyone out.

  One caveat worth carrying into any handover: `bigben@oberrieden.pub` forwards
  to the landlord's own Gmail. Fine while he runs the pub, but it follows the
  person rather than the business — repoint it if the pub ever changes hands.

## `print/` is generated

`banner.html`, `banner.pdf` and `banner.pptx` are all build outputs. Edit the
generators, never the artefacts:

    python print/make-banner.py        # banner.html, from banner.template.html
    python print/make-banner-pdf.py    # banner.pdf, from banner.html
    python print/make-banner-pptx.py   # banner.pptx

The wording lives in `banner.template.html` **and** `make-banner-pptx.py`, so a
copy change means editing both. `print/README.md` has the detail.

The QR code points at `oberrieden.pub/review`, never at Google directly. That
is the point: the review link has changed three times and the poster has never
needed reprinting.

## Verifying your work

The preview pane caps out around 800px, so wide layouts come back cropped and
screenshots drop frames. LibreOffice cannot run on this machine, so a `.pptx`
cannot be rendered for inspection either.

Measure instead: geometry in millimetres, text widths against their containers
using the real font files, contrast ratios, QR codes decoded through an actual
reader, `npm run build` and its postbuild check. Then hand it to the owner, who
does the visual approval and is better placed to — they see it at real size, in
the actual pub.
