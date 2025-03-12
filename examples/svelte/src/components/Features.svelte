<script>
  import { t, Translate } from "../languages";
  import { Archive, Beef, Bird, ChartNoAxesCombined, Component, Flower } from "@lucide/svelte";

  const features = [
    {
      name: t('适用任意场景'),
      description: t('全面支持React/Vue/Solidjs/Uniapp/Nodejs/Svelte/Astro/...等任何ts/js场景'),
      icon: Beef,
    },
    {
      name: t('全流程工具链'),
      description: t('覆盖从语言提取、编译、自动翻译、插件集成等国际化全流程支持，为大型应用提供工程化支持'),
      icon: Bird,
    },
    {
      name: t('自动翻译'),
      description: t('支持在线翻译服务和基于AI大模型的翻译工具,可以实现自动化翻译'),
      icon: Archive,
    },
    {
      name: t('多库联动'),
      description: t('支持大型应用中多个外部库的国际化联动,适合企业应用和第三方库开发'),
      icon: Component,
    },
    {
      name: t('语言补丁'),
      description: t('应用发布后，可以通过语言补丁方式在线修复翻译错误，极致实用性'),
      icon: Flower,
    },
    {
      name: t('测试覆盖率'),
      description: t('核心运行时`@voerkai18n/runtime`超过90%的测试覆盖率，保证品质'),
      icon: ChartNoAxesCombined,
    },
  ];
</script>

<section class="bg-white dark:bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
    <div class="mx-auto max-w-screen-xl space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
      {#each features as feature, index}
        <div>
          <button
            type="button"
            class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            <svelte:component this={feature.icon} />
          </button>

          <h3 class="mb-2 text-xl text-gray-600 font-bold dark:text-white">
            <Translate message={() => feature.name} />
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            <Translate message={() => feature.description} />
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>
