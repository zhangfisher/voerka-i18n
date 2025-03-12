import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import copyPlugin from "vite-copy-plugin"; 
 
export default defineConfig({
	plugins: [
		sveltekit(),
		copyPlugin([
			
				{ 
					from: 'src/install', 
					to: './dist/install' 
				}
			])			
	]
});