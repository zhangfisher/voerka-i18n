import moduleTools, { defineConfig } from "@modern-js/module-tools";

export default defineConfig({
	plugins: [moduleTools()],
	buildPreset: "npm-library-es2018",
	buildConfig: [
		{
			format: "esm",
			sourceMap: true,
			minify: "terser",
		},
	],
});
