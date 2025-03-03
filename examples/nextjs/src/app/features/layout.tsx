import "@/utils/scope"
import Link from 'next/link'
import { Translate } from "@/languages/server"

 

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-row container gap-4 p-8 mt-18"> 
        <div className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <Link href="/features/patch" className="block w-full px-4 py-2 border-b border-gray-200 rounded-t-lg cursor-pointer dark:bg-gray-800 dark:border-gray-600">
                <Translate message="语言补丁" />
            </Link>
            <Link href="/features/translate" className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <Translate message="自动翻译" />
            </Link>
            <Link href="/features/multilib" className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <Translate message="多库联动"/>
            </Link>
            <Link href="/features/server-component" className="block w-full px-4 py-2 rounded-b-lg cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <Translate message="服务端组件" />
            </Link>
        </div>
        <div className="flex-grow flex ">
          {children}
        </div>
      
    </div>
  );
}
