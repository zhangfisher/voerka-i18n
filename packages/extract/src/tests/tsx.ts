import { extractMessages } from "../"; 
 
const code = ` 
function myComponent(){
  const tasks=[
     { 
        title: t("完成项目报告"), 
        description: t("整理本季度的项目进度,准备PPT,并在周五之前发送给项目经理审阅。"), 
      },
      { 
        title: t("准备周会演示文稿"), 
        description: t("汇总团队本周工作内容,制作简报,重点突出项目里程碑的完成情况。"), 
      },
      { 
        title: t("安排团队建设活动"), 
        description: t("联系活动策划公司,讨论团建方案,预算控制在每人500元以内,时间定在下个月第一个周末。"), 
      },
      { 
        title: t('更新个人简历',1,3),  
      },
      { 
        title: t(()=>"学习新的编程语言",1,()=>{}),  
      }
] 
  return <div title={t("任务")}  placeholder="t("提示任务")">
    <span>{ t("标题") }</span>    
    <Translate message="a" />
    <Translate message={'b'} />
    <Translate message={'b1'+t('b2')} />
    <Translate message={'b3'+ x +'b4'} />
    <Translate message='c' vars="1"></Translate>
    <Translate message={()=>{
      console.log('d1')
      console.log(t('d2'))
    }/>
    <Translate vars={[a,b,c]} message={()=>t('e')}/>
    <Translate vars={[a,b,c]} message={f} ></Translate>
    { t("f1") + t('f2') }
  </div>
}
`

console.log(extractMessages(code,{
    language:'tsx'
}).map(({message})=>message))
  