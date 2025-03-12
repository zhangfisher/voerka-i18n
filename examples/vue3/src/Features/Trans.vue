<template>
    <div>
        <div className="block mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <Translate message="翻译组件" />
            </h5>
            <div className="font-normal text-gray-700 dark:text-gray-400">
                <SyntaxHighlighter :code="code" />
                <h4 className="my-2">
                    <Translate message="输出:" />
                </h4>
                <p className="mx-y p-4 rounded bg-gray-100 ">
                    <Translate message="My name is {}" vars="fisher" />
                </p>
            </div>
        </div>

        <div 
            className="block  mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <Translate message="异步翻译组件" />
            </h5>
            <div className="font-normal text-gray-700 dark:text-gray-400">
                <SyntaxHighlighter :code="code" />
                <h4 className="my-2">
                    <Translate message="输出:" />
                </h4>
                <p className="mx-y p-4 rounded bg-gray-100">
                    <Translate :message="async () => 'My name is {}'" vars="deepseek" />
                </p>
            </div>
        </div>

        <div 
            className="block  mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <Translate message="异步翻译组件-加载出错" />
            </h5>
            <div className="font-normal text-gray-700 dark:text-gray-400">
                <SyntaxHighlighter :code="code"  />
                <h4 className="my-2">
                    <Translate message="输出:" />
                </h4>
                <p className="mx-y p-4 rounded bg-gray-100">
                    <Translate :message="async () => { throw new Error() }" vars="deepseek" :default="t('加载中...')" />
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { t, Translate } from "../languages"
import SyntaxHighlighter from "../components/SyntaxHighlighter"


const code = `
    <Translate :message="async (language)=>throw new Error()" 
        vars="deepseek" 
        :default="t('加载中...')" />
`

</script>
