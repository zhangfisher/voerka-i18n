<script setup lang="ts">
import { t, i18nScope } from "./languages";
import { test } from 'voerkai18n-example-lib'

i18nScope.on('change', (newLanguage) => {
  console.log('newLanguage', newLanguage)
})

async function handleChange() {
  const current = i18nScope.global.activeLanguage === 'zh' ? 'en' : 'zh'
  await i18nScope.change(current)
  console.log(t("中文"))
  test()
}
</script>

<template>
  <div>
    <span>{{ t("中文") }}</span>
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
