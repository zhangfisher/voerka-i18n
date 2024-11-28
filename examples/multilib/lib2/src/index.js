import { t, i18nScope } from "./languages";
import {utils_test} from 'voerkai18n-example-utils'

function test_lib2() {
  console.log('lib2 call self',t("库:中文"));
  console.log('lib2 call utils_test\n');
  utils_test()
}
i18nScope.on("change", (newLanguage) => {
  console.log("lib2 changed", newLanguage);
});

export { test_lib2 };
