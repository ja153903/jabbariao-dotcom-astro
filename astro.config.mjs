import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "rose-pine-moon",
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: ["js", "ts", "tsx", "jsx", "bash", "css", "json"],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true
    }
  },
  output: "server",
  adapter: vercel()
});