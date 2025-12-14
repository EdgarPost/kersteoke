import { defineConfig, envField } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  env: {
    schema: {
      SPOTIFY_CLIENT_ID: envField.string({ context: "server", access: "secret" }),
      SPOTIFY_CLIENT_SECRET: envField.string({ context: "server", access: "secret" }),
      APP_BASE_URL: envField.string({ context: "server", access: "secret" }),
    }
  }
});