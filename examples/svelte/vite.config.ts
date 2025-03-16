import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite'; 
import i18nPlugin from '@voerkai18n/plugins/vite'

export default defineConfig({
	plugins: [
		i18nPlugin(),
		sveltekit(),
		tailwindcss()]
});
