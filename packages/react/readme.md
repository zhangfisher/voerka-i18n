[![fisher/voerka-i18n](https://gitee.com/zhangfisher/voerka-i18n/widgets/widget_card.svg?colors=4183c4,ffffff,ffffff,e3e9ed,666666,9b9b9b)](https://gitee.com/zhangfisher/voerka-i18n)


`@voerkai18n/react`用来进行自动文本映射和导入`t`函数

源码与文档:[https://gitee.com/zhangfisher/voerka-i18n](https://gitee.com/zhangfisher/voerka-i18n)


```ts
import { createTranslateComponent, vitePlugIn } from '@voerkai18n/react';

// vite.config.ts
import { i18nPlugIn } from '@voerkai18n/react';
import voerkai18n from '@voerkai18n/vite';

export default defineConfig({
  plugins: [
    i18nPlugIn(),
    voerkai18n()
  ]
})

```