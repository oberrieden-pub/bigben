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

## What has a clock on it

Checked 19 September 2026.

| Thing | Expires | Who has to act |
|---|---|---|
| Domain `oberrieden.pub` | **18 September 2027** | Nobody, in the normal case: auto-renew is on in Paul's Cloudflare account, confirmed 19 September 2026. What is left is the card - Cloudflare cannot renew against an expired one. About CHF 25/year, and the only recurring cost of the whole site. |
| TLS certificate | 17 December 2026 | Nobody. 90-day Let's Encrypt, reissued automatically by GitHub Pages. |
| Pages deployment | Never | The last deployment keeps serving whether or not anyone touches the repo. |
| Scheduled workflows | n/a | There are none, deliberately - see the hours note above. |

Two ways the certificate can break, both DNS:

- Turning on Cloudflare's proxy (orange cloud) for the apex or `www`. GitHub
  cannot then complete the renewal challenge. Those records must stay DNS-only.
- Changing the apex A records away from GitHub's four:
  185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.

Nothing else has an expiry, and with auto-renew on, nothing on this list needs
a diary entry. The site depends on no API key, token or third-party account:
the only credentials anywhere near it are the ones that own the domain and the
repository. The single realistic way it goes dark is a card expiring on the
Cloudflare account a year from now, which is worth knowing precisely because
nobody will be looking at the site by then.

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

   **Handover list: the accounts nobody on this side can log in to.** These are
   not code changes and cannot be done from this repo. They need whoever holds
   the pub's Facebook, Instagram and Google logins, and they should all happen
   in the same sitting as the three steps above.

   | Where | What | Currently |
   |---|---|---|
   | Facebook | Website field -> `oberrieden.pub` | `big-ben-oberrieden.ch` - the abandoned site, which serves an injected online-casino advertorial inside its About section. Facebook is actively sending people to it. |
   | Facebook | Contact email -> `bigben@oberrieden.pub` | `ptischler5@gmail.com`, a personal address |
   | Facebook | Description | "English Pub on the edge of Zurich" - the site deliberately no longer calls itself British or English |
   | ~~Instagram~~ | ~~Bio link~~ | **Done** 20 September 2026. Was the Facebook profile; that link is deleted, so `oberrieden.pub` is now the only one. Only editable in the phone app - the browser greys the field and says so. |
   | ~~Instagram~~ | ~~Bio wording~~ | **Done** 20 September 2026. Was "English Pub on the edge of Zurich". |
   | ~~Instagram~~ | ~~Handle~~ | **Done** 20 September 2026: `@bigbenpubzh` -> `@oberrieden.pub`. Old handle released to anyone after 14 days and cannot be reclaimed early. |
   | Google Business Profile | Website field -> `oberrieden.pub` | `flowsight.ch/bigben-pub` |
   | ~~Google Business Profile~~ | ~~Saturday hours -> 13:30~~ | **Done**, 19 September 2026. The owner updated it; not independently verified from this repo, because Google puts a consent wall in front of Maps. |

   **If the regular week ever changes**, it is one line in `src/data/pub.ts`
   and a push. The table, the open/closed line and the structured data all
   read from that one array, so they cannot disagree with each other - but
   nothing makes them agree with Google. Whoever edits the Business Profile
   should say so.

   Deliberately not automated, and it is worth writing down why, because the
   obvious objection is that DanDoku already does this.

   `DanDoku/.github/workflows/pages.yml` runs a daily cron that polls the game
   repositories with `git ls-remote`, compares them against the fingerprint in
   the deployed `build-info.json`, and redeploys only on a difference. It is a
   good pattern and it is cheap for one specific reason: the upstream is public,
   so it holds no token, no key and no secret, and asks for `contents: read`.

   Google's hours are not public. Maps sits behind a consent wall and the
   Places API wants a key on a billing-enabled project, so the same workflow
   here would need the two things that pattern exists to avoid. On top of that,
   **GitHub disables scheduled workflows after 60 days of repository
   inactivity** - which this repo is meant to have once handed over. Note that
   DanDoku does not solve this either; its workflow commits nothing, so it stays
   enabled only because that repo is actively worked on. A drift check here
   would quietly stop checking, which is the exact failure this site exists to
   avoid.

   One-off exceptions belong on Google regardless: they expire there, and on a
   web page they would not.

   **Meta access, done 20 September 2026.** The pub's Facebook and Instagram
   sit in a Meta business portfolio owned by the landlord, and a second person
   has been added under Personen with **Vollstaendige Kontrolle** (Full
   control). That removes the previous arrangement, which was sharing the
   landlord's password - the same dependency the domain and the repository are
   deliberately free of.

   **Account recovery uses the landlord's own private address**, the one on
   his phone. Not written here, and not `bigben@oberrieden.pub`, which was
   the first instinct and is wrong: that address is published on this site,
   in the Impressum and in the structured data. A recovery address anyone can
   read is half a credential given away, and it is the half an attacker
   cannot otherwise guess.

   The trade accepted with it: recovery is tied to a personal mailbox rather
   than something redirectable, so if that address is ever lost or the
   landlord steps back, **the recovery route has to be changed in Meta before
   that happens**, not after. Put it on the list whenever anything else about
   his contact details changes.

   The phone field is deliberately empty. The pub's number is a landline and
   cannot take an SMS code, and a personal mobile would tie recovery to a
   handset as well as a mailbox.

   Who does what, so the access list is not a mystery to the next person:
   the landlord owns the portfolio, Jackie Newell runs the media side - which
   means Instagram, and therefore everything the site defers to it for - and
   the technical side is separate. All three currently hold Uneingeschraenkter
   Zugriff (full control) over Alles, which is fine for three people who know
   each other but does mean any of them can remove the others.

   Three things that cost an hour and will cost the next person the same:

   - The invitation email frequently never arrives. Accept it instead by
     opening business.facebook.com signed in as the invited person; the
     pending invite appears there. Expect a password reset loop on the way.
   - The invited email must be **exactly** the one on that person's Facebook
     account. Any other address is accepted, shows Ausstehend forever, and
     never links.
   - Business Suite has no language setting of its own: it follows the
     Facebook account's. The `?locale=en_GB` trick no longer works on the
     `/latest/` routes, so either change the owner's Facebook language or work
     in German.

   The Facebook one matters most. Of the places that link to the pub, Facebook
   currently points at a page that reads as though the pub endorses online
   gambling.

   Note on verifying any of this: Google Maps and Google Search both sit behind
   a consent wall for a fresh browser, and Facebook answers curl with HTTP 400
   whether a page exists or not. None of these can be checked from a script.
   They have to be opened in a signed-in browser by someone who holds the
   logins.
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
6. ~~Replace the Google Maps search links.~~ **Done.** `googleProfile` goes to
   the listing and `googleReview` opens Google's write-a-review dialog
   directly, both on the pub's own place id rather than a search. The place id
   is derived from the feature id rather than looked up - see the comment in
   `pub.ts`. Paul's Business Profile short link is no longer needed, though it
   would be a drop-in replacement if Google ever changes the format.
7. **Have a native speaker read the German pages aloud once.** Swiss spelling throughout,
   `ss` not `ß`, but unchecked by a native speaker.

## Running cost

About CHF 25 a year, all of it the domain. Hosting, DNS, TLS and email forwarding are free.
