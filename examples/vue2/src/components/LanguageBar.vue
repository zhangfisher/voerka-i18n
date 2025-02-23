<template>
    <ul class="language-bar">
    <li v-for="lang in languages">
        <button 
            @click="changeLanguage(lang.name)" 
            :class="{ active: lang.name === activeLanguage }"
            :key="lang.name">{{ lang.title }}-{{ lang.name }}</button>
    </li> 
    </ul>
  </template>
  
  <script lang="ts">
  import Vue from 'vue';
  import { Translate,i18nScope } from '../languages';
  import { i18nMixin,withI18n } from '@voerkai18n/vue2';

  export default withI18n({   
    name: 'language-bar',
    mixins: [ i18nMixin ],
    components: {
      Translate,
    },
    props: {
      msg: String,
    },
    data() {
      
    },
    created() {
      this.languages = i18nScope.languages;
      this.activeLanguage = i18nScope.activeLanguage;
    
    },
  })
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="less">
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  </style>
  