<template>
    <ul class="language-bar"> 
        <li v-for="lang in languages">
            <button 
                class="lang-button"
                @click="changeLanguage(lang.name)" 
                :class="{ active: lang.name === activeLanguage }"
                :key="lang.name">{{ lang.title }}-{{ lang.name }}</button>
        </li> 
    </ul>
  </template>
  
  <script lang="ts">
  import { i18nScope } from '../languages';
  import { withI18n } from '@voerkai18n/vue2';

  export default withI18n({   
  },i18nScope)

  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="less">
  .language-bar{
    padding: 4px;
    margin-right: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    
    & > li{
        display: inline-block;
        margin-right: 2px;
        list-style: none;
    }
  }
  .lang-button{
    cursor: pointer;
    padding: 6px;
    margin-right: 6px;
    border: 1px solid #42b983;
    border-radius: 4px;
    background-color: white;
    &.active{
      background-color: #42b983;
      color: white;
    }
  }
  </style>
  