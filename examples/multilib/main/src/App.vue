<script setup lang="ts">
import { t, i18nScope } from "./languages";
import {test_lib1} from 'voerkai18n-example-lib1'
import {test_lib2} from 'voerkai18n-example-lib2'
import {utils_test} from 'voerkai18n-example-utils'

i18nScope.on('change', (newLanguage) => {
  console.log('main changed', newLanguage)
})

async function handleChange() {
  const current = i18nScope.global.activeLanguage === 'zh' ? 'en' : 'zh'
  await i18nScope.change(current)
  console.log(`main call self`, t("中文"))
  console.log(`main call lib1\n`)
  test_lib1()
  console.log(`main call lib2\n`)
  test_lib2()
  console.log(`main call utils\n`)
  utils_test()
}
</script>

<template>
  <div>
    <button @click="handleChange">切换</button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
