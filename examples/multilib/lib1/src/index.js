import { t, i18nScope } from "./languages";
import {utils_test} from 'voerkai18n-example-utils'

function test_lib1() {
  console.log('lib1 call self',t("库:中文"));
  console.log('lib1 call utils_test\n');
  utils_test()
}
i18nScope.on("change", (newLanguage) => {
  console.log("lib1 changed", newLanguage);
});

export { test_lib1 };
