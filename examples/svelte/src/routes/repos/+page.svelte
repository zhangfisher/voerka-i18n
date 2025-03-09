<script lang="ts"> 
import { GitFork, Star, UserRound } from '@lucide/svelte';
import { Translate } from "../../languages"
import type { Repo } from "./$types";

const { data }:{data:{repos:Repo[]}} = $props()

</script>

<section class="py-8 antialiased dark:bg-gray-900 md:py-8 pt-2 px-2 min-h-lvh">
  <div class="mx-auto max-w-screen-xl px-2 2xl:px-0">
    <div class="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
      {#each data.repos as repo}
            <div class="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 hover:shadow-md">
            <div class="flex flex-row items-center justify-between">
              <a
                href={repo.url}
                class="text-lg font-semibold leading-tight text-blue-700 hover:underline dark:text-white"
              >
                {repo.title}
              </a>
              <span class="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    data-tooltip-target="tooltip-quick-look"
                    class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <GitFork class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    data-tooltip-target="tooltip-add-to-favorites"
                    class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <Star class="w-4 h-4" />
                  </button>
                </span>
            </div>
            <div class="flex flex-row items-center justify-between">
              <span>
              <UserRound class="inline text-gray-400 w-4 h-4 mr-1"/>{repo.author}
              </span>
              <span class="flex me-2 text-amber-300 rounded bg-primary-100 px-0 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  <Star size='16'/>
                  <Star size='16' />
                  <Star size='16' />
                  <Star size='16' />
                  <Star size='16' />
              </span>
            </div>
            <div class="mt-2 min-h-16 text-gray-900 dark:text-white">
              <Translate message={() => repo.description} />
            </div> 
          </div>
      {/each}

    </div>
    <div class="w-full text-center">
      <button
        type="button"
        class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
      >
        <Translate message='更多开源项目...' />
      </button>
    </div>
  </div>
</section>