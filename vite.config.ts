// @lovable.dev/vite-tanstack-config already includes the required plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    base: "/palestine-support-portal/",
  },
});
