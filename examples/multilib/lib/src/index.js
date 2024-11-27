import { t, i18nScope } from "./languages";
function test() {
    console.log(t('库'))
}
i18nScope.on('change', (newLanguage) => {
    console.log('lib1 changed', newLanguage)
  })
export {test}