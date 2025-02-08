import { Edit,Delete, SquareCheckBig, ClipboardCheck, Square } from "lucide-react"

const tasks = [
    { 
        id: 1, 
        title: "完成项目报告", 
        description: "整理本季度的项目进度,准备PPT,并在周五之前发送给项目经理审阅。",
        completed: false, 
        createdAt: new Date(2023, 5, 1).toISOString(), 
        completedAt: null
      },
      { 
        id: 2, 
        title: "准备周会演示文稿", 
        description: "汇总团队本周工作内容,制作简报,重点突出项目里程碑的完成情况。",
        completed: true, 
        createdAt: new Date(2023, 5, 2).toISOString(), 
        completedAt: null
      },
      { 
        id: 3, 
        title: "安排团队建设活动", 
        description: "联系活动策划公司,讨论团建方案,预算控制在每人500元以内,时间定在下个月第一个周末。",
        completed: false, 
        createdAt: new Date(2023, 5, 3).toISOString(), 
        completedAt: null
      },
      { 
        id: 4, 
        title: "更新个人简历", 
        description: "添加最近完成的项目经验,更新技能列表,重新设计简历版式使其更有吸引力。",
        completed: true, 
        createdAt: new Date(2023, 5, 4).toISOString(), 
        completedAt: new Date(2023, 5, 6).toISOString()
      },
      { 
        id: 5, 
        title: "学习新的编程语言", 
        description: "开始学习Python,完成Codecademy上的Python入门课程,每天至少编程1小时。",
        completed: false, 
        createdAt: new Date(2023, 5, 5).toISOString(), 
        completedAt: null
      }
]

export default function Task(){
    return (
        <div className="container mx-auto mt-18 pt-8 px-8 min-h-lvh">
            <div className=" shadow border border-gray-50 mx-1 mb-1 p-4 flex flex-row align-middle justify-center">
                <span className="self-center text-gray-600 text-2xl font-semibold whitespace-nowrap mx-0 mt-2 dark:text-white">
                我的任务
                </span> 
                <div className="flex-grow text-right">ddd
                </div>
            </div>
             
            {/*  TABS */}
            <div  className="border-b border-gray-200 dark:border-gray-700">
                <ul  className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li  className="me-2">
                        <a href="#"  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                            <svg  className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                            </svg>全部
                        </a>
                    </li>
                    <li  className="me-2">
                        <a href="#"  className="inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" aria-current="page">
                            <svg  className="w-4 h-4 me-2 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                            </svg>未完成
                        </a>
                    </li>
                    <li  className="me-2">
                        <a href="#"  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                            <svg  className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z"/>
                            </svg>已完成
                        </a>
                    </li>
                    <li  className="me-2">
                        <a href="#"  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                            <svg  className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                            </svg>已过期
                        </a>
                    </li>
                </ul>
            </div>

            <div  className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table  className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead  className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col"  className="px-6 py-3 w-0.5">
                                
                            </th>
                            <th scope="col"  className="px-6 py-3">
                                标题
                            </th>
                            <th scope="col"  className="px-6 py-3">
                                描述
                            </th>
                            <th scope="col"  className="px-6 py-3">
                                创建于
                            </th>
                            <th scope="col"  className="px-6 py-3">
                                完成
                            </th> 
                            <th scope="col"  className="px-6 py-3">
                                动作
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task,index)=>{
                            return (
                                <tr 
                                key={index}
                                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50">
                                <td scope="row"  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <ClipboardCheck />
                                </td>
                                <td  className="px-6 py-4">
                                    {task.title}
                                </td>
                                <td  className="px-6 py-4">
                                    {task.description}                    
                                </td>
                                <td  className="px-6 py-4">
                                    {task.createdAt}
                                </td> 
                                <td  className="px-6 py-4">
                                    { task.completed ? 
                                        <SquareCheckBig className="text-green-600"/> 
                                        : <Square className="text-gray-300"/> }
                                </td>
                                <td  className="px-6 py-4 flex-nowrap flex flwx-row">
                                    <button type="button"  title="编辑"
                                            className="cursor-pointer mr-2 px-3 py-2 text-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                                    ><Edit size="16"/></button>
                                    <button type="button" title="编辑"
                                            className="cursor-pointer text-xs  hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                                    ><Delete size="16"/></button>
                                    
                                </td>
                            </tr> )
                        })}
                        
                    </tbody>
                </table>
            </div>

        </div>
    )
}