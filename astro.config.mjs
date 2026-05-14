import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://ultra.sieker.dk",
  integrations: [tailwind({ applyBaseStyles: false })],
});
