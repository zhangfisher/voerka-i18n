import { t, i18nScope } from "./languages";

function utils_test() {
  console.log('utils call self',t("工具:中文"));
}
i18nScope.on("change", (newLanguage) => {
  console.log("utils changed", newLanguage);
});

export { utils_test };
