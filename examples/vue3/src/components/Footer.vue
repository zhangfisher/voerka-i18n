<template>
    <footer class="p-4 bg-gray-100 md:p-8 lg:p-10 dark:bg-gray-800 w-full">
      <div class="mx-auto max-w-screen-xl text-center">
        <h2 class="my-6 text-gray-500 dark:text-gray-400">
          <Translate message="用心开源，精良制作" />
        </h2>
        <ul class="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          <li>
            <a href="#" class="text-gray-500 dark:text-gray-400 mr-4 hover:underline md:mr-6">
              <Translate message="关于" />
            </a>
          </li>
          <li>
            <a href="#" class="text-gray-500 dark:text-gray-400 mr-4 hover:underline md:mr-6">
              <Translate message="联系我们" />
            </a>
          </li>
          <li>
            <a href="#" class="text-gray-500 dark:text-gray-400 mr-4 hover:underline md:mr-6">
              <Translate message="常见问题" />
            </a>
          </li>
          <li>
            <a href="#" class="text-gray-500 dark:text-gray-400 mr-4 hover:underline md:mr-6">
              <Translate message="开源推荐" />
            </a>
          </li>
        </ul>
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          <Translate message="版权所有 © 2021-2022" />
        </span>
      </div>
    </footer>
  </template>
  
<script setup>

import { Translate } from '../languages';

</script>
  
