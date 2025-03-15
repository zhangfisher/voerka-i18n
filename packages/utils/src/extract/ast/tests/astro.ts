import { extractMessages } from "../.."; 
 
const code = ` 
---
const todos = ref([
    { 
        title: t("完成项目报告"), 
        description: t("整理本季度的项目进度,准备PPT,并在周五之前发送给项目经理审阅。")
      },
      { 
        title: t("准备周会演示文稿"), 
        description: t("汇总团队本周工作内容,制作简报,重点突出项目里程碑的完成情况。")
      },
      { 
        title: t("安排团队建设活动"), 
        description: t("联系活动策划公司,讨论团建方案,预算控制在每人500元以内,时间定在下个月第一个周末。")
      },
      { 
        title: t("更新个人简历"), 
        description: t("添加最近完成的项目经验,更新技能列表,重新设计简历版式使其更有吸引力。")
      },
      { 
        title: t("学习新的编程语言"), 
        description: t("开始学习Python,完成Codecademy上的Python入门课程,每天至少编程1小时。")
      }
]); 
---
const MyComponent()=>{
    return (
  <div class="todo-container">
  <h1>{ t('T1') }</h1>
  <input keyup.enter={addTodo(t('T2'))} placeholder={"Add a new todo"+t('T3')} />
  <ul>
    {
      tasks.map(task=>{
        return (
          <li title={"T4: 任务"} :key="index">
            <span class="{ completed: todo.completed }">{ todo.text }</span>
            <button title={t('T5')+t('T6')} onClick=()=>{t("T7")} >
              { t("T8") + t("T9") }
            </button>
            <button title="t('Tx0',1,2)">{ t("T10") }</button>
            <button>{ t("T8") }</button>
            <button onClick={editTodo(index,t('T9'))}>{ t("T10",11,{}) }</button>
            <Translate message="T12"/>
            <Translate vars="v1" message="T13" />
            <Translate vars="v2" message='T14' />
            <Translate vars="v3" message={"T15"} />
            <Translate vars="v4" message={"T15"+x+"T16"} />
            <Translate vars="v5" message="T17" options="sss">xxx</Translate>
            <Translate vars="v6" message="T18" options={"sss"}>yyy</Translate>
            <Translate vars="v6" message={()=>"ddd"} options={{a:1}}>yyy</Translate>
            <Translate vars="v6" message={()=>"ddd"} options={()=>{}}>yyy</Translate>
        </li>)
      })
    }      
  </ul>
  <div>
  { 
    t("T19")
    + t("T20",1,{o:1})
    + t("T21","a",{o2:"2"})
    + t("T22",["a","b"],{})
  }
  </div>
  <div>t("Tx1")</div>
  <span vars="v1" message="T13" />
  <!-- t("Tx2") -->
  </div> )
  }
`

console.log(extractMessages(code,{
    language:'astro'
}).map(({message})=>message))
  