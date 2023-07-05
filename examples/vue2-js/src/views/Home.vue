<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld/>
    <div>
        <button v-for="lng of languages" :key="lng.name" @click="changeLanguage(lng.name)">{{lng.title}}</button> 
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { i18nMixin } from "../../../../packages/vue2/dist"

export default {
  name: 'Home',
  mixins:[i18nMixin()],
  components: {
    HelloWorld
  }, 
  data:()=>{ 
    return {}
  },
  methods:{ 
  }
}
</script>
