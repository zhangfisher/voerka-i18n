import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import i18nPlugin from '@voerkai18n/plugins/vite'

export default defineConfig({
  vite: {
    plugins: [
      i18nPlugin(),
      tailwindcss()]
  }
});
