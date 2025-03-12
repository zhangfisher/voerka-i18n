import React, { useState } from 'react'
import classnames from 'classnames'
import Trans from "./Trans"
import Patch from './Patch'
import { t,Translate } from "../languages"


const features = [
    { title:t("翻译组件"), component: <Trans/> },
    { title:t("语言补丁"), component: <Patch/> }
]

export default function Features(){
    const [active,setActice] = useState(0)
    return (
        <div className="container mx-auto mt-18 pt-8 px-8 min-h-lvh">
            <div className="md:flex">
                <ul className="flex-column w-50 p-0 min-h-300 text-sm font-medium text-gray-500 md:me-4 mb-4 md:mb-0 border-1 rounded border-gray-200 ">
                    {features.map((feature,index)=>(
                        <li key={index} 
                            className={classnames("cursor-pointer text-center py-4 hover:bg-blue-700 ext-gray-900  hover:text-white",
                            index===active ? "text-indigo-600 ": ""                
                        )}
                        onClick={()=>setActice(index)}>
                            <a href="#">
                                <Translate message={()=>feature.title}/>
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="p-6 bg-gray-50 text-medium text-gray-500 w-full">
                    {
                        features.map((feature,index)=>{
                            return (<div key={index} style={{display:index===active ? "block":"none"}}>
                                { feature.component }
                            </div>)
                        })
                    }        
                </div>
            </div>
        </div>
    )
}
