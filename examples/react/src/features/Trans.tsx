import { t, Translate } from "../languages"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


export default function Trans(){

    
    return <div>        
        
        <a href="#" className="block mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <Translate message="翻译组件"/>
            </h5>
            <div className="font-normal text-gray-700 dark:text-gray-400">
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {`<Translate message={"My name is {}"} vars="fisher" />`}
                </SyntaxHighlighter>
                <h4 className="my-2"><Translate message="输出:"/></h4>
                <p className="mx-y p-4 rounded bg-gray-100 ">
                    <Translate message={"My name is {}"} vars="fisher"/>
                </p>             
            </div>
        </a>

        <a href="#" className="block  mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <Translate message="异步翻译组件"/>
            </h5>
            <div className="font-normal text-gray-700 dark:text-gray-400">
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {`<Translate message={async (language)=>"My name is {}"} vars="deepseek" />`}
                </SyntaxHighlighter>
                <h4 className="my-2"><Translate message="输出:"/></h4>
                <p className="mx-y p-4 rounded bg-gray-100">
                    <Translate message={async ()=>"My name is {}"} vars="deepseek"/>
                </p>             
            </div>
        </a>

        <a href="#" className="block  mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <Translate message="异步翻译组件-加载出错"/>
            </h5>
            <div className="font-normal text-gray-700 dark:text-gray-400">
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {`<Translate message={async (language)=>{
                        throw new Error("")
                    }} vars="deepseek" default={t("加载中...")}  />`}
                </SyntaxHighlighter>
                <h4 className="my-2"><Translate message="输出:"/></h4>
                <p className="mx-y p-4 rounded bg-gray-100">
                <Translate message={async ()=>{
                        throw new Error("")
                    }} vars="deepseek" default={t("加载中...")} />
                </p>             
            </div>
        </a>
    </div>
}