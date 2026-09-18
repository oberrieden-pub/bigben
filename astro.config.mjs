// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://oberrieden.pub",

  // Emit de.html rather than de/index.html, so the URLs the site already has
  // keep working. Nothing external links here yet, but there is no reason to
  // churn them.
  build: { format: "file" },

  image: {
    // Widths the responsive images are generated at. A phone takes the 480,
    // not the 2400 it used to be served.
    responsiveStyles: true,
  },
});
