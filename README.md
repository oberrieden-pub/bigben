# Big Ben Pub, Oberrieden — oberrieden.pub

Static files. No build step, no dependencies, no server-side code.

The site deliberately carries **no fixture list**. Match nights live on the pub's Google
Business Profile and on Instagram, where they expire on their own. These pages only point
at those, so there is nothing here that can go stale and nothing the landlord has to edit.

English and German are separate pages, not one bilingual page. The switch is the link in
the top right of each page and in the footer.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | English page. |
| `de.html` | German page. Swiss spelling, so `ss` rather than `ß`. |
| `getting-here.html` | Map and directions, English. |
| `anfahrt.html` | Map and directions, German. |
| `assets/site.css` | All styling, shared by both pages. Edit once, both change. |
| `assets/status.js` | The open/closed line. Shared. Language comes from `data-lang`. |
| `assets/photos/` | **Placeholders taken from the old site.** Unlicensed. Replace. |
| `.nojekyll` | Stops GitHub Pages running the files through Jekyll. |
| `google-sites/` | Everything needed to rebuild this in Google Sites instead. |
| `CNAME` | Binds GitHub Pages to `oberrieden.pub`. |

## Publishing on GitHub Pages

1. Create a repository under **the landlord's own GitHub account**, not a consultant's.
   Free GitHub Pages requires the repository to be public.
2. Commit these files at the repository root.
3. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
4. The site appears at `https://<account>.github.io/<repo>/` within a couple of minutes.

### Custom domain

The domain is **oberrieden.pub**, registered at Cloudflare, which also runs the DNS. The
`CNAME` file at the repository root holds the bare domain and is what binds Pages to it.

DNS records in the Cloudflare zone, all of them **DNS only (grey cloud)**:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `thrd-gh.github.io` |

**The grey cloud matters.** A proxied (orange cloud) record stops GitHub issuing its TLS
certificate, and Cloudflare's Flexible SSL mode would put the site in a redirect loop. If
the proxy is ever switched on later, GitHub's certificate must already exist and
Cloudflare's SSL mode must be **Full (strict)**.

Once the records resolve, tick **Enforce HTTPS** in Settings → Pages. The certificate can
take up to an hour, and DNS up to 24.

GitHub Pages serves the apex domain directly, so no `www` prefix is needed. Google Sites
cannot do this; see below.

## Three ways to host this

- **GitHub Pages.** Free, patches nothing, serves the apex domain, keeps the design exactly
  as built. Adds a GitHub account to the credentials list, needs a public repository, is a
  US service with no support line, and assumes whoever takes over can use a git repository.
- **Infomaniak.** Bundles hosting and an email address with the CHF 8.90 `.ch` domain.
  Domain, DNS, email and files sit in one Swiss account with a phone number, and updates
  are a drag into a web file manager. One account instead of three, and the easiest
  handover for a landlord who may one day need to ring somebody.
- **Google Sites.** Cannot host these files at all; the page has to be rebuilt in its own
  editor. Free and maintenance-free, but it costs the apex domain, the design, and the
  claim that the site embeds nothing from third parties. See `google-sites/BUILD-SHEET.md`,
  which has the full trade-off and paste-ready copy for both languages.

## The business, for the record

| | |
|---|---|
| Operator | The luck of the Irish GmbH, trading as Big Ben Pub |
| UID | CHE-157.131.031 (SHAB, new entry 26.02.2024) |
| Managing director | Paul Michael Tischler, sole signatory |
| Address | Alte Landstrasse 20, 8942 Oberrieden ZH |
| Phone | 043 388 55 08 (landline, to be redirected to Paul's mobile) |
| Email | bigben@oberrieden.pub — Cloudflare Email Routing, forwards to Paul's mailbox |
| Stale phone | 044 722 20 62 — still circulating on third-party listings, not ours |
| Instagram | @bigbenpubzh — confirmed correct, the other handle is to be closed |
| Facebook | Big Ben Pub Oberrieden — confirmed correct |
| Hours | Confirmed with the landlord 13 September 2026 |

Hours, phone, food and handles all come from the landlord's own review notes, so the site
is not guessing at any of them.

## Still open

1. **Replying as the pub.** `bigben@oberrieden.pub` receives, but Cloudflare Email Routing
   forwards only, so Paul's replies leave from his own address. Fixing that means either
   Gmail "Send mail as" over Gmail's SMTP (free, needs an app password and a hand-edited
   SPF record, and never gets aligned DKIM) or a real mailbox. Not urgent: a pub is
   contacted by phone. Costs are in the session notes; nothing here exceeds CHF 115/year.
2. **Replace the photographs.** The two shots in `assets/photos/` were taken from the
   previous owner's site so the layout could be seen with real images in it. They carry no
   licence. Strip EXIF from the replacements: the originals were 5 MB phone files carrying
   GPS coordinates. Both are captioned as placeholders on the page until then.
3. **Self-host the fonts.** The pages pull Bodoni Moda, Faustina and Geist from
   `fonts.googleapis.com`, which discloses each visitor's IP address to Google.
4. **Remove the `noindex` tag** from all four pages when the site should be findable. Until
   then Google will not list it at all. This is deliberate, not an oversight.
5. **Decide what happens to flowsight.ch/bigben-pub**, which is currently the official page
   and the target of the Google Business Profile website field. Two live pages for one pub
   is worse than either alone.
6. **Parking**, if there is anything to say. The row was removed from the getting-here page
   rather than shipped empty.
7. **A fixtures calendar**, if wanted. The link was removed because it pointed at a
   calendar that does not exist. It goes back the moment one does.
8. **Confirm control of the Instagram account**, as distinct from the handle being correct.
9. **Have a native speaker read the German page aloud once.** Swiss spelling throughout,
   `ss` not `ß`, but it has not been checked by a native speaker.
10. **Replace the two Google Maps search links** with the pub's own profile short link.


## Notes on the code

- The open/closed line is computed in the browser from `Europe/Zurich`, so it is correct
  for a visitor in any timezone. If the script does not run, each page keeps its static
  fallback line and nothing is broken.
- Hours are written in three places: the `hours` object in `assets/status.js`, and the
  visible table on each page. Change all three together. Regular hours change rarely;
  day-to-day variation belongs on the Google profile, not here.
- No cookies, no storage, no analytics, no forms. The only embedded third-party content
  is the Google map on the getting-here pages, which the privacy notice declares.
- `canonical` and `hreflang` tags point at the live domain, so Google serves the right
  language. They hard-code `https://oberrieden.pub/`; change them if the domain changes.

## Local preview

The pages use relative links to `assets/`, so opening `index.html` straight from the disk
works in a normal browser. To serve it over HTTP instead:

```bash
python -m http.server 8765
```

Then open `http://localhost:8765/`.
