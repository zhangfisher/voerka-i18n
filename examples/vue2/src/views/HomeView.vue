<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld :msg="t('VoerkaI8n全流程国际化解决方案')"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src


export default Vue.extend({
  name: 'HomeView',
  components: {
    HelloWorld,
  },
});
</script>
