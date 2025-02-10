import React, { useCallback, useState } from 'react'
import classNames from 'classnames'
import { i18nScope,t } from '../languages'

type NavItem = {
  name     : string,
  title    : string,
  href?    : string,
  tips?    : string,
  active?  : boolean,
  component: React.ComponentType
}

type NavBarProps = {
    items:NavItem[]
    onClick:(item:NavItem)=>void
}


function Languages(){ 
  const [activeIndex,setActiveIndex] = useState(0)
  const onClick = useCallback((lang:any)=>{    
    const index = i18nScope.languages.findIndex((l)=>l.name === lang.name)
    if(index !== -1){
      setActiveIndex(index)
    }
  },[])
  return (
    <div className="flex md:order-2 flex-row justify-items-center align-middle">            
      {i18nScope.languages.map((lang,index)=>{
          return <button key={index} type="button" onClick={()=>onClick(lang)}
            className={classNames(
              "cursor-pointer border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
              index===activeIndex ? "bg-blue-700 text-white border-gray-300" :"text-gray-900"
            )}> { lang.name }     </button>
      })}
  </div>
  )
}


export default function Navbar(props:NavBarProps) {
    const { items,onClick } = props    
    return (
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://github.com/zhangfisher/voerka-i18n" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-gray-600 text-2xl font-semibold whitespace-nowrap dark:text-white">
              {t('VoerkaI18n')}
            </span>
        </a>
        <div className="flex md:order-2 flex-row justify-items-center align-middle">            
            <Languages/>
         </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {items.map((item,index)=>{
              return <li key={index} className='mr-1'>
                <a 
                  href="#"
                  onClick={()=>onClick(item)}
                  className={classNames(
                    "focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-1 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
                       item.active ? "text-blue-700 bg-gray-50 border-gray-300" :"text-gray-900"
                  )}>
                    {t(item.title)}{item.active}
                </a>
               
              </li>              
            })}            
          </ul>
        </div>
        </div>
      </nav>

    )
}
