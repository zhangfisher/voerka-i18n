import { i18nScope } from './languages'
import './components/i18n-demo'
import './components/i18n-hooks-demo'

// 初始化国际化配置
i18nScope.ready(() => {
  console.log('VoerkaI18n initialized with language:', i18nScope.activeLanguage)
})