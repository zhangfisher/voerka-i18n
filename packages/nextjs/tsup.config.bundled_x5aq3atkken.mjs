// tsup.config.ts
import { defineConfig } from "tsup";
import copyFiles from "esbuild-plugin-copy";
var tsup_config_default = defineConfig([{
  entry: [
    "src/index.ts",
    "src/client/index.ts",
    "src/server/index.ts"
  ],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  noExternal: ["flex-tools", "@voerkai18n/react"],
  cjsInterop: false,
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
    *   ---=== VoerkaI18n for Nextjs ===---
    *   https://zhangfisher.github.io/voerka-i18n/*
    */`
  }
}]);
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiRTpcXFxcV29ya1xcXFxDb2RlXFxcXHZvZXJrYS1pMThuXFxcXHBhY2thZ2VzXFxcXG5leHRqc1xcXFx0c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJFOlxcXFxXb3JrXFxcXENvZGVcXFxcdm9lcmthLWkxOG5cXFxccGFja2FnZXNcXFxcbmV4dGpzXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9FOi9Xb3JrL0NvZGUvdm9lcmthLWkxOG4vcGFja2FnZXMvbmV4dGpzL3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndHN1cCcgXHJcbmltcG9ydCBjb3B5RmlsZXMgZnJvbSBcImVzYnVpbGQtcGx1Z2luLWNvcHlcIlxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhbe1xyXG4gICAgZW50cnk6IFtcclxuICAgICAgICAnc3JjL2luZGV4LnRzJyxcclxuICAgICAgICAnc3JjL2NsaWVudC9pbmRleC50cycsXHJcbiAgICAgICAgJ3NyYy9zZXJ2ZXIvaW5kZXgudHMnXHJcbiAgICBdLFxyXG4gICAgZm9ybWF0OiBbJ2VzbScsJ2NqcyddLFxyXG4gICAgZHRzOiB0cnVlLFxyXG4gICAgc3BsaXR0aW5nOiBmYWxzZSxcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIGNsZWFuOiB0cnVlLFxyXG4gICAgdHJlZXNoYWtlOnRydWUsICAgXHJcbiAgICBtaW5pZnk6IGZhbHNlLFxyXG4gICAgbm9FeHRlcm5hbDpbJ2ZsZXgtdG9vbHMnLCdAdm9lcmthaTE4bi9yZWFjdCddLFxyXG4gICAgY2pzSW50ZXJvcDogZmFsc2UsICAgICAgIFxyXG4gICAgZXNidWlsZFBsdWdpbnM6IFtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgY29weUZpbGVzKHtcclxuICAgICAgICAgICAgYXNzZXRzOntcclxuICAgICAgICAgICAgICAgIGZyb206XCIuL3NyYy9pbnN0YWxsLyoqLypcIixcclxuICAgICAgICAgICAgICAgIHRvOicuL2luc3RhbGwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgXSwgXHJcbiAgICBiYW5uZXI6IHtcclxuICAgICAgICBqczogYC8qKiogICAgICAgIFxyXG4gICAgKiAgIC0tLT09PSBWb2Vya2FJMThuIGZvciBOZXh0anMgPT09LS0tXHJcbiAgICAqICAgaHR0cHM6Ly96aGFuZ2Zpc2hlci5naXRodWIuaW8vdm9lcmthLWkxOG4vKlxyXG4gICAgKi9gfVxyXG59XSkgIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUixTQUFTLG9CQUFvQjtBQUMvUyxPQUFPLGVBQWU7QUFHdEIsSUFBTyxzQkFBUSxhQUFhLENBQUM7QUFBQSxFQUN6QixPQUFPO0FBQUEsSUFDSDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUSxDQUFDLE9BQU0sS0FBSztBQUFBLEVBQ3BCLEtBQUs7QUFBQSxFQUNMLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxFQUNQLFdBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLFlBQVcsQ0FBQyxjQUFhLG1CQUFtQjtBQUFBLEVBQzVDLFlBQVk7QUFBQSxFQUNaLGdCQUFnQjtBQUFBO0FBQUEsSUFFWixVQUFVO0FBQUEsTUFDTixRQUFPO0FBQUEsUUFDSCxNQUFLO0FBQUEsUUFDTCxJQUFHO0FBQUEsTUFDUDtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLElBQUk7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUdMO0FBQ1AsQ0FBQyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
