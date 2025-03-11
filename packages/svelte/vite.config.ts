import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from "node:path"
 
export default defineConfig({
	plugins: [
		sveltekit(),
		viteStaticCopy({
			targets: [
				{ 
					src: 'src/install/**/*.*', 
					dest: path.join(__dirname,'./dist/install') 
				}
			]
		})
	]
});