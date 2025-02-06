<script setup>
import { ref } from 'vue'
import { t } from '../languages'
defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      {{ t('Edit') }}
      <code>{{ t('components/HelloWorld.vue') }}</code> {{ t('to test HMR ') }}
    </p>
  </div>

  <p>
    {{ t('Check out') }}
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"> {{ t('create-vue') }}</a>, the official Vue
    + Vite starter
  </p>
  <p>
    {{ t('Install') }}
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    {{ t('in your IDE for a better DX') }}
  </p>
  <p class="read-the-docs">{{ t('Click on the Vite and Vue logos to learn more') }}</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
