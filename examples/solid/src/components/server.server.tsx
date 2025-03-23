
import { Check } from "./Check"; 
import { Translate } from "~/languages/server";
 

export default function Server() {
  return (
    <div class="max-w-sm p-6 flex-col grow bg-white border border-gray-200 rounded-lg shadow-sm " >
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-600 text-center dark:text-white border-b-1 border-gray-200 pb-4 -mx-[24px]">
        <Translate message="服务端组件"/>
      </h5>
      <div class="font-normal text-gray-700 dark:text-gray-400 py-4">
        <h2 class="mb-2 text-lg text-center font-semibold text-emerald-600 dark:text-white py-2">
          <Translate message="主要特性" />
        </h2>
        <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400 rounded-lg bg-gray-50 p-2">
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="适用任意场景" />
            </li>
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="全流程工具链"/>
            </li>
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="全自动翻译" />
            </li>
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="多库联动" />
            </li>
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="语言补丁" />
            </li> 
        </ul>
        <h2 class="my-2 text-lg text-center font-semibold dark:text-white text-emerald-600 py-2">
          <Translate message="用心开源，精良制作" />
        </h2>
        <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400 rounded-lg bg-gray-50 p-2">
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="联系我们" />
            </li>
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="常见问题" />
            </li>
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="版权所有" />
            </li>
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="友情链接" />
            </li>
            <li class="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded">
              <Check/><Translate message="客户服务" />
            </li> 
        </ul>
      </div>
    </div>
  );
}
