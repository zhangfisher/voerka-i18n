<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <VoerkaI18n :msg="t('VoerkaI8n全流程国际化解决方案')"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VoerkaI18n from '@/components/VoerkaI18n.vue'; // @ is an alias to /src
import { t } from '@/languages';

export default Vue.extend({
  name: 'HomeView',
  components: {
    VoerkaI18n,
  },
  created() {
    console.log('HomeView created');    
  },
});
</script>
