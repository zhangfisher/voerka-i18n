'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from "react";

export function useVoerkaI18n(){
    const router = useRouter();

//   useEffect(() => {
//     const handleRouteChange = (url: string) => {
//       I18n.updateMessages()
//       // 在这里执行你需要的操作，例如更新状态或发送分析数据
//     });

//     // 侦听路由切换事件
//     router.events.on('routeChangeStart', handleRouteChange);

//     // 清理事件侦听器
//     return () => {
//       router.events.off('routeChangeStart', handleRouteChange);
//     };
//   }, [router.events]);
}