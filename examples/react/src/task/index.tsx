import { Edit,Delete, SquareCheckBig, ClipboardCheck, Square, ClipboardPlus, ListTodo, LayoutList, ListChecks, Trash2 } from "lucide-react"

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
            <div className="rounded mx-1 mb-1 p-2 flex flex-row item-center">
                <span className="self-center text-gray-600 text-2xl font-semibold whitespace-nowrap mx-0  dark:text-white">
                我的任务
                </span> 
                <div className="flex-grow flex flex-row item-center content-end justify-end	">
                    <button type="button" className="cursor-pointer px-3 py-2 text-sm font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <ClipboardPlus/>新建
                    </button>
                </div>
            </div>
             
            {/*  TABS */}
            <div  className="border-b border-gray-200 dark:border-gray-700">
                <ul  className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li  className="me-1">
                        <a href="#"  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                            <ListTodo />全部
                        </a>
                    </li>
                    <li  className="me-1">
                        <a href="#"  className="inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" aria-current="page">
                        <LayoutList />未完成
                        </a>
                    </li>
                    <li  className="me-1">
                        <a href="#"  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                        <ListChecks />已完成
                        </a>
                    </li>
                    <li  className="me-1">
                        <a href="#"  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                        <Trash2 />已过期
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
                                    <ClipboardCheck className="text-gray-500" />
                                </td>
                                <td  className="px-0 py-1">
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