import { defineConfig } from "astro/config";

import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: "rose-pine-moon",
      langs: ["js", "ts", "tsx", "jsx", "bash", "css", "json"],
      wrap: true,
    },
  },
});
