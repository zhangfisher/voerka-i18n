<template>
    <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://github.com/zhangfisher/voerka-i18n" class="flex items-center space-x-3 rtl:space-x-reverse">
          <span class="self-center text-gray-600 text-2xl font-semibold whitespace-nowrap dark:text-white">
            VoerkaI18n
          </span>
        </a>
        <div class="flex md:order-2 flex-row justify-items-center align-middle">
          <button  
            v-for="(lang, index) in languages"
            @click="i18nScope.change(lang.name)"
            type="button" 
            class="cursor-pointer border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            :class="{ 'bg-blue-600 text-white': activeLanguage === lang.name }"
            >  
            {{ lang.name }}     
            </button>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            
            <li  class="mr-1">
              <RouterLink to="/" 
              active-class="bg-gray-100 dark:bg-gray-700"
                class="focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-1 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" >
                  <Translate message="首页" />
              </RouterLink>
            </li>
            <li  class="mr-1">
              <RouterLink to="/features" 
                active-class="bg-gray-100 dark:bg-gray-700"
                class="focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-1 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" >
                  <Translate message="特性" />
              </RouterLink>
            </li>
            <li  class="mr-1">
              <RouterLink to="/task" 
              active-class="bg-gray-100 dark:bg-gray-700"
                  class="focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-1 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" >
                  <Translate message="任务" />
              </RouterLink>
            </li>
            <li  class="mr-1">
              <RouterLink to="/repos" 
              active-class="bg-gray-100 dark:bg-gray-700"
                  class="focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-1 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" >
                  <Translate message="开源项目" />
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
<script setup>

import { ref, onMounted,onUnmounted } from 'vue'; 
import { i18nScope, Translate,t } from '../languages';
   
const activeLanguage = ref(i18nScope.activeLangauge);
const languages = i18nScope.languages;


i18nScope.on('change', (lang) => {
  activeLanguage.value = lang;
});
 
const handleChange = (lang) => {
  activeLanguage.value = lang;
};

onMounted(() => {
  i18nScope.on('change',handleChange);
});

onUnmounted(() => {
  i18nScope.off('change',handleChange);
});

</script>