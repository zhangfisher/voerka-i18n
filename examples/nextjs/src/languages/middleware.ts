import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  
    let language = request.cookies.get('language') || 'zh-CN'
    request.t = (message,vars,options)=>{

    }
   
}