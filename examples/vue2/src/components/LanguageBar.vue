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
  import { i18nMixin, WithI18nMixin } from '@voerkai18n/vue2';

  export default {   
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
        
    },
  }
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
  