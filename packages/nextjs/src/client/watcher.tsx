/**
 * 当路由发生变化时，对服务器组件中的翻译组件进行更新
 * 
 */

'use client'
 
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { applyTranslate } from '../utils'
 
export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams() 
  useEffect(() => {
    applyTranslate()
  }, [pathname, searchParams])
  return null
}


export function VoerkaI18nTranslateWatcher(){
    return <Suspense fallback={null}>
        <NavigationEvents />
    </Suspense>
}