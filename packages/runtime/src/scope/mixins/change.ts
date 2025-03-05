/**
 * 
 * 
 * 加载语言包
 * 
 */

import { isFunction } from "flex-tools/typecheck/isFunction";
import { isPlainObject } from "flex-tools/typecheck/isPlainObject";
import type { VoerkaI18nScope } from "..";
import type { VoerkaI18nDynamicLanguageMessages, VoerkaI18nLanguageMessages } from "@/types";
import { IAsyncSignal,asyncSignal } from "asyncsignal"
import {  VoerkaI18nError, VoerkaI18nLoadLanguageError } from "@/errors";
import { loadAsyncModule } from "@/utils/loadAsyncModule";



export class ChangeLanguageMixin{     
    protected _refreshSignal? :IAsyncSignal 

    /** 
     * 刷新语言包 
     * @param language 
     */
    async refresh(this:VoerkaI18nScope,language?:string,options?:{fallback?:boolean,patch:boolean}):Promise<string>{
        if(!this._refreshSignal) this._refreshSignal = asyncSignal() 
        if (!language) language   = this.activeLanguage;        
        let finalLanguage : string = language; 
        let finalMessages : VoerkaI18nLanguageMessages | undefined = undefined
        const { patch,fallback } = Object.assign({ fallback:false,patch:true },options)

        try{
            finalMessages = await this._loadLanguageMessages(language)
            this._activeMessages = finalMessages as VoerkaI18nLanguageMessages
            // 打语言包补丁, 如果是从远程加载语言包则不需要再打补丁了,因为远程加载的语言包已经是补丁过的了            
            if(finalMessages && !finalMessages.$remote && patch) {
                await this.patch(language);
            }
        }catch(e:any){
            // 切换语言失败，回退到默认语言,  注意：回退语言是不可能出错的，无论回退到了何种语言，默认语言总是可以兜底的回退语言
            if(e && e instanceof VoerkaI18nError){
                const fallbackLanguage = this.getFallbackLanguage(language)
                if(fallbackLanguage && fallbackLanguage!==language){
                    finalLanguage = await this.refresh(fallbackLanguage,{ patch,fallback:true })
                }
            }
        }finally{
            if(!fallback){
                this._activeLanguage = finalLanguage
                if(typeof(this.messages[finalLanguage])==='function') this.messages[finalLanguage] = this._activeMessages
                this._activeParagraphs = this._activeParagraphs[finalLanguage]
                this._refreshSignal.resolve()
                this._refreshSignal = undefined
                await this.emit('scope/change',finalLanguage,true)
            }
        }
        this._setLanguageAttr()    
        return finalLanguage
    }
    /**
     * 
     *   通过加载器从远程加载指定语言的语言包
     * 
     *   - 简单的对象{}
     *   - 或者是一个返回Promise<VoerkaI18nLanguageMessages>的异步函数
     *   - 或者是全局的默认加载器 
     * 
     * @param language 语言名称
     * @returns 
     */
    private async _loadLanguageMessages(this:VoerkaI18nScope,language:string):Promise<VoerkaI18nLanguageMessages | undefined>{
        
        this.logger.debug(`准备加载语言包:${language}`)

        // 非默认语言可以是：语言包对象，也可以是一个异步加载语言包文件,加载器是一个异步函数
		// 如果没有加载器，则无法加载语言包，因此回退到默认语言
		const loader = this.messages[language];
        let messages:VoerkaI18nLanguageMessages | undefined = undefined;

        if (isPlainObject(loader)) {                // 静态语言包
            messages = loader as unknown as VoerkaI18nLanguageMessages;
        } else if(isFunction(loader)) {             // 异步chunk语言包 
            try{
                messages = await loadAsyncModule(this,loader)
            }catch(e:any){
                this.logger.error(`加载异步语言包<${language}>失败:${e.message}`)
                messages = undefined
            }
        } 

        // 使用全局默认加载器从服务器加载语言包
        if (!messages && isFunction(this.loader)) { 
            // 从远程加载语言包:如果该语言没有指定加载器，则使用全局配置的默认加载器
            try{
                const remoteMessages = (await this._loadMessagesFromLoader(language)) as unknown as VoerkaI18nDynamicLanguageMessages;
                if(isPlainObject(remoteMessages)){  
                    messages = Object.assign(
                        { $remote : true },                     // 添加一个标识，表示该语言包是从远程加载的                     
                        this.messages[this.defaultLanguage], 
                        remoteMessages
                    ) as VoerkaI18nLanguageMessages;            // 合并默认语言包和动态语言包,这样就可以局部覆盖默认语言包
                }else{
                    this.logger.error(`错误的语言包<${language}>数据:${remoteMessages}`)
                }
            }catch(e:any){
                throw new VoerkaI18nLoadLanguageError(e.message)
            }
        }
        if(!isPlainObject(messages)) throw new VoerkaI18nLoadLanguageError(language)
        return messages
    }
    /**
     * 
     * 从远程加载信息包
     * 
     * @param this 
     * @param language 
     */
    protected async _loadMessagesFromLoader(this:VoerkaI18nScope,language:string){
        if(isFunction(this.loader)){
            return await this.loader.call(this,language,this)      
        }
    }
    /**
     * 
     * - 如果正在刷新语言包，则等待刷新完成
     *  
     * i18nScope.ready(callback,timeout)
     *   
     * @param this 
     * @returns 
     */
    ready(this:VoerkaI18nScope,timeout?:number):Promise<void>  
    ready(this:VoerkaI18nScope,callback:(activeLanguage:string)=>void,timeout?:number):void
    ready(this:VoerkaI18nScope):any{  
        const callback = typeof arguments[0] === 'function' ? arguments[0] : undefined
        const timeout = typeof arguments[0] === 'number' ? arguments[0] : arguments[1]
        if(typeof(callback)==='function'){
            this.manager.ready(callback,timeout)      
        }else{
            return new Promise(resolve=>{
                this.manager.ready(resolve,timeout)      
            })
        }        
    }
    /**
     * await changing()
     * 
     * @param this 
     * @param timeout 
     * @returns 
     */
    async changing(this:VoerkaI18nScope,timeout?:number){
        if(!this._refreshSignal && !this._patching) {
            return        
        }
        await Promise.all([this._refreshSignal?.(timeout), this._patching?.(timeout)]) 
    }
}