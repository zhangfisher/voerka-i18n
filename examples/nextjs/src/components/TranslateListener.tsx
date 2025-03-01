
'use client'
 
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
 
export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log(url)
    I18n.updateMessages()
    // You can now use the current URL
    // ...
  }, [pathname, searchParams])
 
  return '...'
}

export function TranslateListener(){
    return <Suspense fallback={null}>
        <NavigationEvents />
    </Suspense>
}