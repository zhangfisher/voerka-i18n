<script module>

  export type NavItem = {
    url      : string;
    title    : string;
    active?  : boolean 
  };  

  export let items: NavItem[] = [
    { url: '/', title:t('首页'),active:true},
    { url: '/features',title:t('特性')},
    { url: '/repos',title:t('开源项目')} ,
    { url: '/about',title:t('关于')} 
  ]

</script>

<script lang="ts">
  
import classNames from 'classnames';
import { Translate,i18nScope, t } from "../languages"
 

let activeIndex = $state(i18nScope.languages.findIndex((l) => l.name === i18nScope.activeLanguage))

function handleLanguageClick(lang: any) {
    const index = i18nScope.languages.findIndex((l) => l.name === lang.name);
    if (index !== -1) {
      activeIndex = index;
      i18nScope.change(lang.name).then((lang)=>{
        console.log("Language changed to: ", lang);
      })
    }
}

</script>

<nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="https://github.com/zhangfisher/voerka-i18n" class="flex items-center space-x-3 rtl:space-x-reverse">
      <span class="self-center text-gray-600 text-2xl font-semibold whitespace-nowrap dark:text-white">
        VoerkaI18n
      </span>
    </a>
    <div class="flex md:order-2 flex-row justify-items-center align-middle">
      {#each i18nScope.languages as lang, index}
        <button
          type="button"
          onclick={() => handleLanguageClick(lang)}
          class={classNames(
            "cursor-pointer border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
            index === activeIndex ? "bg-blue-700 text-white border-gray-300" : "text-gray-900"
          )}
        >
          {lang.name}
        </button>
      {/each}
    </div>
    <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
      <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        {#each items as item}
          <li class="mr-1">
            <a
              href={item.url} 
              class={classNames(
                "focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-1 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
                item.active ? "text-blue-700 bg-gray-50 border-gray-300" : "text-gray-900"
              )}>
              <Translate message={() => item.title} />
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>

<style>
  /* 你可以在这里添加额外的样式 */
</style>