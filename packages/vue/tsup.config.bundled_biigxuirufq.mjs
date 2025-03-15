// tsup.config.ts
import { defineConfig } from "tsup";
import copyFiles from "esbuild-plugin-copy";
var tsup_config_default = defineConfig([
  {
    entry: [
      "src/index.ts"
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
            *   ---=== VoerkaI18n for Vue ===---
            *   https://zhangfisher.github.io/voerka-i18n
            */`
    }
  }
]);
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiRTpcXFxcV29ya1xcXFxDb2RlXFxcXHZvZXJrYS1pMThuXFxcXHBhY2thZ2VzXFxcXHZ1ZVxcXFx0c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJFOlxcXFxXb3JrXFxcXENvZGVcXFxcdm9lcmthLWkxOG5cXFxccGFja2FnZXNcXFxcdnVlXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9FOi9Xb3JrL0NvZGUvdm9lcmthLWkxOG4vcGFja2FnZXMvdnVlL3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndHN1cCcgIFxyXG5pbXBvcnQgY29weUZpbGVzIGZyb20gXCJlc2J1aWxkLXBsdWdpbi1jb3B5XCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhbXHJcbiAgICB7XHJcbiAgICAgICAgZW50cnk6IFtcclxuICAgICAgICAgICAgJ3NyYy9pbmRleC50cydcclxuICAgICAgICBdLFxyXG4gICAgICAgIGZvcm1hdDogWydlc20nLCdjanMnXSxcclxuICAgICAgICBkdHM6IHRydWUsXHJcbiAgICAgICAgc3BsaXR0aW5nOiBmYWxzZSxcclxuICAgICAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICAgICAgY2xlYW46IHRydWUsXHJcbiAgICAgICAgdHJlZXNoYWtlOnRydWUsICBcclxuICAgICAgICBtaW5pZnk6IHRydWUsICAgICBcclxuICAgICAgICBlc2J1aWxkUGx1Z2luczogW1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGNvcHlGaWxlcyh7XHJcbiAgICAgICAgICAgICAgICBhc3NldHM6e1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb206XCIuL3NyYy9pbnN0YWxsLyoqLypcIixcclxuICAgICAgICAgICAgICAgICAgICB0bzonLi9pbnN0YWxsJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF0sIFxyXG4gICAgICAgIGJhbm5lcjoge1xyXG4gICAgICAgICAgICBqczogYC8qKipcclxuICAgICAgICAgICAgKiAgIC0tLT09PSBWb2Vya2FJMThuIGZvciBWdWUgPT09LS0tXHJcbiAgICAgICAgICAgICogICBodHRwczovL3poYW5nZmlzaGVyLmdpdGh1Yi5pby92b2Vya2EtaTE4blxyXG4gICAgICAgICAgICAqL2BcclxuICAgICAgICB9XHJcbiAgICB9XHJcbl0pICJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVEsU0FBUyxvQkFBb0I7QUFDdFMsT0FBTyxlQUFlO0FBRXRCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCO0FBQUEsSUFDSSxPQUFPO0FBQUEsTUFDSDtBQUFBLElBQ0o7QUFBQSxJQUNBLFFBQVEsQ0FBQyxPQUFNLEtBQUs7QUFBQSxJQUNwQixLQUFLO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUEsSUFDWCxPQUFPO0FBQUEsSUFDUCxXQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixnQkFBZ0I7QUFBQTtBQUFBLE1BRVosVUFBVTtBQUFBLFFBQ04sUUFBTztBQUFBLFVBQ0gsTUFBSztBQUFBLFVBQ0wsSUFBRztBQUFBLFFBQ1A7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDSixJQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJUjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
