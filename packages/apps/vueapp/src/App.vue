<script setup>
import {reactive } from 'vue'

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import China from './components/china.vue'
import Formatters from './components/formatters.vue'

let messages = reactive({
  name: t('VoerkaI18n多语言解决方案 ')
})

console.log("App=",messages.name)

setTimeout(() => {
  messages.name = 'Vue App 2'
}, 5000)

// console.log(t("Hello world!"))
</script>  
<script>
import {reactive } from 'vue'
export default {
  inject: ['i18n'],
  data() {
    return {
      language: this.i18n.activeLanguage,
    }
  },
  watch: { 
     
  },
  methods: {
    async changeLanguage(value) { 
       this.i18n.activeLanguage = value
       //this.activeLanguage = value
       // await this.i18n.change(this.language)
    } 
  }
}
</script>  
<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <h1>{{ t("中华人民共和国")}} </h1>
    <h2>{{ t("迎接中华民族的伟大复兴")}} </h2>
    <China :title="t('中华人民共和国')" />
    <Formatters/>
        <h5>默认语言：{{ i18n.defaultLanguage }}</h5>
        <h5>当前语言：{{ i18n.activeLanguage.value }}</h5>
        <button :key="lng.name" v-for="lng of i18n.languages" @click="i18n.activeLanguage = lng.name" style="padding:8px;margin:8px;cursor:pointer" :style="{'outline' : lng.name === i18n.activeLanguage.value ? '2px red solid' : ''}" >{{ lng.title }}</button>
        <button @click="i18n.activeLanguage = 'de'" style="padding:8px;margin:8px;cursor:pointer" :style="{'outline' : i18n.activeLanguage.value === 'de' ? '2px red solid' : ''}" >德语</button>
        <button @click="i18n.activeLanguage = 'jp'" style="padding:8px;margin:8px;cursor:pointer" :style="{'outline' : i18n.activeLanguage.value === 'jp' ? '2px red solid' : ''}" >日语</button>
  </div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
