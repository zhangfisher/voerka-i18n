import { useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import HomePage from './home'
import TaskPage from './task'
import SettingPage from './settings'
import RepoPage from './repos'
import { Footer } from './components/Footer'

const pages = [
  { name: 'home', title:"首页",active:true, component:HomePage},
  { name: 'task',title:"任务", component:TaskPage},
  { name: 'repos',title:"开源项目", component:RepoPage},
  { name: 'settings', title:"设置", component:SettingPage},
]

export default function App() {
  const [active, setActive] = useState(0)

  const onClickItem = useCallback((item:any) => {
    pages.forEach((p)=>{
      const activeIndex = pages.findIndex((p)=>p.name === item.name)
      if(activeIndex !== -1){
        setActive(activeIndex)
        p.active = true
      }else{
        p.active = false
      }
    })
  },[])

  const Page = pages[active].component

  return (
    <> 
      <div className="min-h-full">
       <Navbar items={pages} onClick={onClickItem}/>
       <Page/>
       <Footer/>
      </div>
    </>
  )
}
