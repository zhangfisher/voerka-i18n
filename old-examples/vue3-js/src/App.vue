<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { injectVoerkaI18n } from "packages/vue3/src"  
const i18n = injectVoerkaI18n()
</script>
<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <span><b>默认语言：</b>{{ i18n.defaultLanguage }}&nbsp;&nbsp;&nbsp;&nbsp;<b>当前语言：</b>{{ i18n.activeLanguage }}</span>
  </div>
  <HelloWorld msg="Vite + Vue" />
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
