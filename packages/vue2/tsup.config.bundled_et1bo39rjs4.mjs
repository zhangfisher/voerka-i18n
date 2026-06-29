// tsup.config.ts
import { defineConfig } from "tsup";
import copyFiles from "esbuild-plugin-copy";
var tsup_config_default = defineConfig({
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
  external: ["vue"],
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
*   ---=== VoerkaI18n for Vue2 ===---
*   https://zhangfisher.github.io/voerka-i18n
*/`
  }
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiRTpcXFxcV29ya1xcXFxDb2RlXFxcXHZvZXJrYS1pMThuXFxcXHBhY2thZ2VzXFxcXHZ1ZTJcXFxcdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiRTpcXFxcV29ya1xcXFxDb2RlXFxcXHZvZXJrYS1pMThuXFxcXHBhY2thZ2VzXFxcXHZ1ZTJcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0U6L1dvcmsvQ29kZS92b2Vya2EtaTE4bi9wYWNrYWdlcy92dWUyL3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndHN1cCcgXHJcbmltcG9ydCBjb3B5RmlsZXMgZnJvbSBcImVzYnVpbGQtcGx1Z2luLWNvcHlcIlxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBlbnRyeTogW1xyXG4gICAgICAgICdzcmMvaW5kZXgudHMnXHJcbiAgICBdLFxyXG4gICAgZm9ybWF0OiBbJ2VzbScsJ2NqcyddLFxyXG4gICAgZHRzOiB0cnVlLFxyXG4gICAgc3BsaXR0aW5nOiBmYWxzZSxcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIGNsZWFuOiB0cnVlLFxyXG4gICAgdHJlZXNoYWtlOnRydWUsICBcclxuICAgIG1pbmlmeTogdHJ1ZSxcclxuICAgIGV4dGVybmFsOltcInZ1ZVwiXSwgICAgXHJcbiAgICBlc2J1aWxkUGx1Z2luczogW1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBjb3B5RmlsZXMoe1xyXG4gICAgICAgICAgICBhc3NldHM6e1xyXG4gICAgICAgICAgICAgICAgZnJvbTpcIi4vc3JjL2luc3RhbGwvKiovKlwiLFxyXG4gICAgICAgICAgICAgICAgdG86Jy4vaW5zdGFsbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICBdLCBcclxuICAgIGJhbm5lcjoge1xyXG4gICAgICAgIGpzOiBgLyoqKiAgICAgICAgXHJcbiogICAtLS09PT0gVm9lcmthSTE4biBmb3IgVnVlMiA9PT0tLS1cclxuKiAgIGh0dHBzOi8vemhhbmdmaXNoZXIuZ2l0aHViLmlvL3ZvZXJrYS1pMThuXHJcbiovYH1cclxufSkgIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0USxTQUFTLG9CQUFvQjtBQUN6UyxPQUFPLGVBQWU7QUFHdEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsT0FBTztBQUFBLElBQ0g7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRLENBQUMsT0FBTSxLQUFLO0FBQUEsRUFDcEIsS0FBSztBQUFBLEVBQ0wsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLEVBQ1AsV0FBVTtBQUFBLEVBQ1YsUUFBUTtBQUFBLEVBQ1IsVUFBUyxDQUFDLEtBQUs7QUFBQSxFQUNmLGdCQUFnQjtBQUFBO0FBQUEsSUFFWixVQUFVO0FBQUEsTUFDTixRQUFPO0FBQUEsUUFDSCxNQUFLO0FBQUEsUUFDTCxJQUFHO0FBQUEsTUFDUDtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLElBQUk7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUdUO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
