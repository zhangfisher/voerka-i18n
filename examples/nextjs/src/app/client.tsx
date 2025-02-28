'use client'

import { Check } from "@/components/Check";
import { Translate } from "@/components/Translate";
import { useVoerkaI18n } from "@/hooks/useVoerkaI18n"; 

 
export default function Client() {
  useVoerkaI18n()
  return (
    <div className="max-w-sm p-6 flex-col grow bg-white border border-gray-200 rounded-lg shadow-sm server">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-600 text-center dark:text-white border-b-1 border-gray-200 pb-4 -mx-[24px]">
        <Translate message="客户端组件"/>
      </h5>
      <div className="font-normal text-gray-700 dark:text-gray-400 py-4">
        <h2 className="mb-2 text-lg font-semibold text-center text-emerald-600 dark:text-white py-2">
          主要特性
        </h2>
        <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400 rounded-lg bg-gray-50 p-2">
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>适用任意场景</li>
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>全流程工具链</li>
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>全自动翻译</li>
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>多库联动</li>
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>语言补丁</li> 
        </ul>
        <h2 className="my-2 text-lg font-semibold  text-center dark:text-white text-emerald-600 py-2">
          用心开源，精良制作
        </h2>
        <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400 rounded-lg bg-gray-50 p-2">
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>联系我们</li>
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>常见问题</li>
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>版权所有</li>
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>友情链接</li>
            <li className="cursor-pointer p-2 flex items-center hover:bg-gray-100 hover:rounded"><Check/>客户服务</li> 
        </ul> 
      </div>
    </div>
  );
}