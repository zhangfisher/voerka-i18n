// tsup.config.ts
import { defineConfig } from "tsup";
import copyFiles from "esbuild-plugin-copy";
var tsup_config_default = defineConfig({
  entry: [
    "src/index.tsx"
  ],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  esbuildPlugins: [
    // @ts-ignore
    copyFiles({
      assets: {
        from: "./src/install/**/*",
        to: "./install"
      }
    })
  ],
  banner: {
    js: `/***
*   ---=== VoerkaI18n for React ===---
*   https://zhangfisher.github.io/voerka-i18n
*/`
  }
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiRTpcXFxcV29ya1xcXFxDb2RlXFxcXHZvZXJrYS1pMThuXFxcXHBhY2thZ2VzXFxcXHJlYWN0XFxcXHRzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkU6XFxcXFdvcmtcXFxcQ29kZVxcXFx2b2Vya2EtaTE4blxcXFxwYWNrYWdlc1xcXFxyZWFjdFwiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vRTovV29yay9Db2RlL3ZvZXJrYS1pMThuL3BhY2thZ2VzL3JlYWN0L3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndHN1cCcgXHJcbmltcG9ydCBjb3B5RmlsZXMgZnJvbSBcImVzYnVpbGQtcGx1Z2luLWNvcHlcIlxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBlbnRyeTogW1xyXG4gICAgICAgICdzcmMvaW5kZXgudHN4J1xyXG4gICAgXSxcclxuICAgIGZvcm1hdDogWydlc20nLCdjanMnXSxcclxuICAgIGR0czogdHJ1ZSxcclxuICAgIHNwbGl0dGluZzogZmFsc2UsXHJcbiAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICBjbGVhbjogdHJ1ZSxcclxuICAgIHRyZWVzaGFrZTp0cnVlLCAgXHJcbiAgICBtaW5pZnk6IHRydWUsICAgICAgICBcclxuICAgIGVzYnVpbGRQbHVnaW5zOiBbXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGNvcHlGaWxlcyh7XHJcbiAgICAgICAgICAgIGFzc2V0czp7XHJcbiAgICAgICAgICAgICAgICBmcm9tOlwiLi9zcmMvaW5zdGFsbC8qKi8qXCIsXHJcbiAgICAgICAgICAgICAgICB0bzonLi9pbnN0YWxsJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIF0sIFxyXG4gICAgYmFubmVyOiB7XHJcbiAgICAgICAganM6IGAvKioqXHJcbiogICAtLS09PT0gVm9lcmthSTE4biBmb3IgUmVhY3QgPT09LS0tXHJcbiogICBodHRwczovL3poYW5nZmlzaGVyLmdpdGh1Yi5pby92b2Vya2EtaTE4blxyXG4qL2B9XHJcbn0pICJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsU0FBUyxvQkFBb0I7QUFDNVMsT0FBTyxlQUFlO0FBR3RCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLE9BQU87QUFBQSxJQUNIO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUSxDQUFDLE9BQU0sS0FBSztBQUFBLEVBQ3BCLEtBQUs7QUFBQSxFQUNMLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxFQUNQLFdBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLGdCQUFnQjtBQUFBO0FBQUEsSUFFWixVQUFVO0FBQUEsTUFDTixRQUFPO0FBQUEsUUFDSCxNQUFLO0FBQUEsUUFDTCxJQUFHO0FBQUEsTUFDUDtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLElBQUk7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUdUO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
