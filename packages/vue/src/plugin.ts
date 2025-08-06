import { VoerkaI18nManager, VoerkaI18nScope } from "@voerkai18n/runtime";
import { ref } from "vue";
import type { App, Plugin } from "vue";

export type VoerkaI18nVuePluginOptions = {
  i18nScope?: VoerkaI18nScope;
};

export const i18nPlugin: Plugin<VoerkaI18nVuePluginOptions> = {
  install: (app: App, options?: VoerkaI18nVuePluginOptions) => {
    const { i18nScope } = Object.assign(
      {
        i18nScope: undefined,
      },
      options
    );
    const manager: VoerkaI18nManager = globalThis.VoerkaI18n;
    const curScope = i18nScope || manager.scope;
    if (!manager || !curScope) {
      throw new Error("VoerkaI18n is not installed");
    }

    let activeLanguage = ref(curScope.activeLanguage);

    curScope.on("change", () => {
      activeLanguage.value = curScope.activeLanguage;
    });
    app.config.globalProperties.$activeLanguage = activeLanguage;

    // 注入一个全局可用的t方法，在组件模板中可以直接使用
    app.config.globalProperties.t = function (message: string, ...args: any[]) {
      // 由于t函数依赖于activeLanguage.value,所以当activeLanguage.value变化时会触发重新渲染
      activeLanguage.value;
      return curScope.t(message, ...args);
    };

    curScope.options.onTranslated = (result: string) => {
      activeLanguage.value;
      return result;
    };

    app.component("Translate", curScope.Translate);
  },
};
