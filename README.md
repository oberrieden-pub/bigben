# Big Ben Pub, Oberrieden — oberrieden.pub

An [Astro](https://astro.build) site that builds to static HTML. Nothing is shipped to the
browser except one small inline script for the open/closed line.

The site deliberately carries **no fixture list and no event listings**. Match nights and
music go on the pub's Google Business Profile and Instagram, where they expire on their
own. These pages only point at those, so there is nothing here that goes stale and nothing
the landlord has to edit. If you are ever asked to "add the fixtures to the site", that
request undoes the design. Raise it first.

English and German are separate pages. The switch is in the top right and in the footer.

Working on this? Read **`AGENTS.md`** first. It carries the design decisions
and the reasons behind them, and the traps that have already caught someone.
This file is the orientation; that one is what stops you undoing something on
purpose.

## Running it

```bash
npm install
npm run dev
```

`npm run build` writes `dist/`. The first build takes a couple of minutes because Astro
generates every image size and format; later builds use its cache.

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/pub.ts` | **Every fact about the pub.** Hours, address, phone, email, links. |
| `src/pages/*.astro` | One file per page. `index` and `de` are the front pages. |
| `src/layouts/Base.astro` | Head, top bar, footer. Edit once, all pages change. |
| `src/components/Hours.astro` | Opening hours table, generated from the data. |
| `src/components/StatusPill.astro` | The open/closed line and its browser script. |
| `src/components/Gallery.astro` | Photo grid. |
| `src/assets/photos/` | Source photographs. Astro derives the responsive sizes. |
| `src/styles/site.css` | All styling, as design tokens. |
| `src/styles/fonts.css` | Self-hosted @font-face rules. No third-party font service. |
| `src/components/SchemaOrg.astro` | BarOrPub structured data, generated from `pub.ts`. |
| `public/CNAME` | Binds GitHub Pages to `oberrieden.pub`. |

**Opening hours are defined once**, in `src/data/pub.ts`, as minutes from midnight indexed
by day. The table, the day grouping (`Tuesday – Wednesday` appears by itself when two days
match) and the open/closed line all derive from it. They used to live in three places.

## Photographs

Put new ones in `src/assets/photos/` and import them in the page. Astro generates AVIF at
several widths and writes the `srcset`, so a phone downloads roughly 25KB where it used to
get a 1600px JPEG.

Two rules that have already come up:

- **Strip EXIF.** The originals arrive from a phone carrying GPS coordinates.
- **Check for people.** Photographs with identifiable customers or musicians need their
  consent before they go on a public site. Consent for the live-music set is confirmed,
  which is why it is in use. Anything new needs the same check.

Also watch for Samsung's burnt-in "AI-generated content" label on edited shots. One
supplied photo had a wall digitally rendered smooth that is actually bare concrete; the
unedited original is the one on the site.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with Astro and deploys
to GitHub Pages. Pages is set to **build from a workflow**, not from a branch. There is no
committed build output.

### Custom domain

`oberrieden.pub`, registered at Cloudflare, which also runs the DNS. Records, all **DNS only (grey cloud)**:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` through `8003::153` |
| CNAME | `www` | `thrd-gh.github.io` — stale, see below |
| MX + TXT | `@` | Cloudflare Email Routing, added by its own onboarding |

**The grey cloud matters.** A proxied record stops GitHub issuing its TLS certificate, and
Cloudflare's Flexible SSL mode would cause a redirect loop.

The `www` CNAME still points at `thrd-gh.github.io`, where the repository used to live.
It works, because GitHub Pages routes on the Host header rather than the CNAME target, but
it is misleading. Repoint it at `oberrieden-pub.github.io` when convenient.

**A trap worth knowing:** changing the Pages custom domain through the API makes GitHub
commit to this repository itself (`Delete CNAME`, `Create CNAME`), so the next push is
rejected as non-fast-forward. Rebase onto it rather than forcing.

## Still open

1. ~~**Going live.**~~ **Done 20 September 2026, with the owner's approval.**
   The `noindex` default in `src/layouts/Base.astro` is off, so all six content
   pages are indexable; `/review` keeps its own, being only a redirect. The
   Google Business Profile website field points here, and its Menu tab at
   `oberrieden.pub#menu`. `public/robots.txt` allows everything and names the
   sitemap, and `scripts/sitemap.mjs` writes `dist/sitemap.xml` at build time
   from whatever the build produced, skipping anything noindexed - a
   hand-written list would go stale the first time someone added a page.

   Search Console and Bing Webmaster Tools both done the same day. The
   `noindex` prop survives on the layout so a future draft page can opt itself
   out. Verified live from outside: no robots meta on any content page,
   `robots.txt` and `sitemap.xml` both served.
2. ~~Self-host the fonts.~~ **Done.** Bitter, Cabin and Geist are served from
   `public/fonts/`, subsetted to Basic Latin, Latin-1 Supplement and a little
   punctuation. Only the six weights the pages actually render are included. If
   you ever add a character outside that range, or a new weight, regenerate
   them; otherwise the browser will silently fall back.
3. ~~Consent for the live-music photographs.~~ **Confirmed by the owner.** They
   are in use on both front pages.
4. ~~Replace the Google Maps search links.~~ **Done.** `googleProfile` goes to
   the listing and `googleReview` opens Google's write-a-review dialog
   directly, both on the pub's own place id rather than a search. The place id
   is derived from the feature id rather than looked up - see the comment in
   `pub.ts`. Paul's Business Profile short link is no longer needed, though it
   would be a drop-in replacement if Google ever changes the format.
5. ~~Have a native speaker read the German pages aloud once.~~ **Done 29 September
   2026.** Swiss spelling throughout, `ss` not `ß`.

## Running cost

About CHF 25 a year, all of it the domain. Hosting, DNS, TLS and email forwarding are free.

## What is on the page

Eight sections, each with an anchor: `#sport` `#hours` `#menu` `#darts`
`#music` `#pub` `#bookings` `#find`. The ids are English on the German page
too - they are addresses, not copy, and the language switch relies on them
being identical to keep your place.

The topbar is sticky and carries a **section menu** (`SectionNav.astro`),
which is the only navigation on the site. The darts section uses
`Carousel.astro`, one photograph at a time, advancing itself; the music and
pub sections use `Gallery.astro`, a strip you scroll. `AGENTS.md` explains
when to reach for which, and what not to strip out of the carousel.

## IndexNow

`public/<key>.txt` and `scripts/indexnow.mjs`. The key is public by design:
the search engine fetches that file to check whoever submitted controls the
site. Do not rename or remove it - the key in the file must stay identical to
the file's own name, and the script refuses to run if they drift apart.

    npm run indexnow              # dry run, lists what would be sent
    node scripts/indexnow.mjs --send

URLs come from the sitemap the build just wrote, so anything noindexed is
never submitted.

**Google does not take part in IndexNow.** Bing does, and through Bing so do
DuckDuckGo and Ecosia; Yandex, Seznam and Naver also do. Google gets the
sitemap and Search Console, and nothing here changes that. Worth being clear
about, because the search problem that matters most - the abandoned
big-ben-oberrieden.ch outranking the pub's own site - is a Google problem and
IndexNow does not touch it.

Deliberately not wired into `postbuild`: every deploy would ping whether or
not anything changed, which is how a key gets ignored for spamming. Run it
when something has actually changed.
