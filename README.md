# Big Ben Pub, Oberrieden — oberrieden.pub

An [Astro](https://astro.build) site that builds to static HTML. Nothing is shipped to the
browser except one small inline script for the open/closed line.

The site deliberately carries **no fixture list and no event listings**. Match nights and
music go on the pub's Google Business Profile and Instagram, where they expire on their
own. These pages only point at those, so there is nothing here that goes stale and nothing
the landlord has to edit. If you are ever asked to "add the fixtures to the site", that
request undoes the design. Raise it first.

English and German are separate pages. The switch is in the top right and in the footer.

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
| `google-sites/` | An earlier alternative, kept for the reasoning. Not in use. |

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

`oberrieden.pub`, registered at Cloudflare in the landlord's own account, which also runs
the DNS. Records, all **DNS only (grey cloud)**:

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

### Where this repository lives

`github.com/oberrieden-pub/bigben`, in an organisation owned by Paul's account, so the
site does not depend on any one person's personal account. It was moved here from
`THRD-GH/bigben-pub`; GitHub redirects the old URL. A duplicate copy of the history also
sits at `ptischler5-beep/bigben`, which is now redundant and should be deleted by its
owner so there is one obvious source.

## The business, for the record

| | |
|---|---|
| Operator | The luck of the Irish GmbH, trading as Big Ben Pub |
| UID | CHE-157.131.031 (SHAB, new entry 26.02.2024) |
| Managing director | Paul Michael Tischler, sole signatory |
| Address | Alte Landstrasse 20, 8942 Oberrieden ZH |
| Phone | 043 388 55 08 (landline, to be redirected to Paul's mobile) |
| Email | bigben@oberrieden.pub, forwards via Cloudflare to Paul's mailbox |
| Instagram | @bigbenpubzh — the other handle is to be closed |
| Facebook | Big Ben Pub Oberrieden |
| Hours | Confirmed with the landlord 13 September 2026 |
| Music | Live Irish music most Sundays, not every Sunday |

**Everything on the site is ground truth, verified by the owner.** The written
notes in the case folder cover hours, phone, socials and the snack list only;
live music, darts, the sports shown, Guinness, parking and the bus were
confirmed by him directly and are not in that file. A reviewer reading only the
notes will flag them as unsourced. They are not.

## Still open

1. **Going live is held pending the owner's final approval.** Every page carries
   `noindex, nofollow`, so Google lists nothing. This is deliberate, not an
   oversight, and it is one decision with three parts that belong together:

   1. Remove the `noindex` meta in `src/layouts/Base.astro`.
   2. Point the Google Business Profile website field at `oberrieden.pub`
      (it currently points at flowsight.ch/bigben-pub).
   3. Submit the domain to Google Search Console.

   Doing only the first leaves the site findable but unlinked from the pub's
   most valuable asset. Doing only the second sends people to a page search
   engines are told to ignore. Wait for approval, then do all three.
2. **Decide what happens to flowsight.ch/bigben-pub**, currently the official page and the
   target of the Google Business Profile website field. Two live pages for one pub is
   worse than either alone.
3. **Replying as the pub.** Cloudflare Email Routing forwards only, so replies leave from
   Paul's own address. Fixing it means Gmail "Send mail as" over Gmail's SMTP, or a real
   mailbox. Not urgent: a pub is contacted by phone.
4. ~~Self-host the fonts.~~ **Done.** Bitter, Cabin and Geist are served from
   `public/fonts/`, subsetted to Basic Latin, Latin-1 Supplement and a little
   punctuation. Only the six weights the pages actually render are included. If
   you ever add a character outside that range, or a new weight, regenerate
   them; otherwise the browser will silently fall back.
5. ~~Consent for the live-music photographs.~~ **Confirmed by the owner.** They
   are in use on both front pages.
6. **Replace the Google Maps search links** with the pub's own profile short link.
7. **Have a native speaker read the German pages aloud once.** Swiss spelling throughout,
   `ss` not `ß`, but unchecked by a native speaker.

## Running cost

About CHF 25 a year, all of it the domain. Hosting, DNS, TLS and email forwarding are free.
