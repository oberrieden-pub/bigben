# Big Ben Pub, Oberrieden — two-page site

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
| `assets/site.css` | All styling, shared by both pages. Edit once, both change. |
| `assets/status.js` | The open/closed line. Shared. Language comes from `data-lang`. |
| `assets/photos/` | **Placeholders taken from the old site.** Unlicensed. Replace. |
| `.nojekyll` | Stops GitHub Pages running the files through Jekyll. |
| `google-sites/` | Everything needed to rebuild this in Google Sites instead. |
| `CNAME` | Not committed. Add it only when the custom domain is settled. |

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

## Before it goes live

Each page carries a visible "Before this goes live" block, and the placeholders in the
Impressum are marked in orange. Both must be filled in or removed. In short:

1. Legal operator name, contact email on the new domain, UID if registered.
2. Host's log retention period, for the privacy paragraph.
3. **Self-host the fonts.** The pages currently load Bodoni Moda, Faustina and Archivo
   Narrow from `fonts.googleapis.com`, which discloses the visitor's IP address to Google
   and contradicts the pages' own claim to embed nothing from third parties. Either
   download the woff2 files into `assets/fonts/` and swap the `<link>` for a local
   `@font-face` block, or delete the `<link>` and let the fallback stacks do the work.
4. **Replace the photographs.** The two shots in `assets/photos/` were taken from the
   previous owner's site so the layout could be seen with real images in it. They carry no
   licence and ownership is unclear, so they must be replaced with new photography before
   this is presented as live or handed to anyone. Strip EXIF from the replacements: the
   originals arrived as 5 MB phone files carrying GPS coordinates. The old logo is not used
   at all; the wordmark is set in type.
5. Create the public Google Calendar for match nights and put its ID into the fixtures link
   on both pages. The link is a placeholder and currently goes nowhere.
5. Confirm control of the Instagram handle before linking it anywhere permanent.
6. Replace the Google Maps search links with the pub's own profile short link.
7. Add `hreflang` tags between the two pages once the domain exists, so Google serves the
   right language.
8. Have a native speaker read the German page aloud once.
9. Remove the draft strip and the "Before this goes live" section from both pages.

## Notes on the code

- The open/closed line is computed in the browser from `Europe/Zurich`, so it is correct
  for a visitor in any timezone. If the script does not run, each page keeps its static
  fallback line and nothing is broken.
- Hours are written in three places: the `hours` object in `assets/status.js`, and the
  visible table on each page. Change all three together. Regular hours change rarely;
  day-to-day variation belongs on the Google profile, not here.
- No cookies, no storage, no analytics, no forms, nothing embedded.

## Local preview

The pages use relative links to `assets/`, so opening `index.html` straight from the disk
works in a normal browser. To serve it over HTTP instead:

```bash
python -m http.server 8765
```

Then open `http://localhost:8765/`.
