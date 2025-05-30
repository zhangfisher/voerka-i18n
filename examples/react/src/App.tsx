import { useCallback, useState } from 'react'
import { t } from './languages'
import Navbar from './components/Navbar'
import HomePage from './home'
import TaskPage from './task' 
import FeaturesPage from "./features"
import RepoPage from './repos'
import AboutPage from './about'

import { Footer } from './components/Footer'

const pages = [
  { name: 'home', title:t('首页'),active:true, component:HomePage},
  { name: 'features',title:t('特性'), component:FeaturesPage},
  { name: 'task',title:t('任务'), component:TaskPage},
  { name: 'repos',title:t('开源项目'), component:RepoPage} ,
  { name: 'about',title:t('关于'), component:AboutPage} 
]

export default function App() {
  const [active, setActive] = useState(0)

  const onClickItem = useCallback((item:any) => {
    pages.forEach((p)=>{
      p.active = false
    })
    const index = pages.findIndex((p)=>p.name === item.name)
    if(index !== -1){
      pages[index].active = true
      setActive(index)        
    } 
  },[])

  const Page = pages[active].component

  return (<div className="min-h-full">
      <Navbar items={pages} onClick={ onClickItem } />
      <Page/>
      <Footer/>
  </div>)
}
