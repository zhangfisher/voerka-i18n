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



export class ChangeLanguageMixin{     
    protected _refreshSignal? :IAsyncSignal 
    /** 
     * 刷新语言包 
     * @param language 
     */
    async refresh(this:VoerkaI18nScope,language?:string){
        this._refreshSignal = asyncSignal() 
        if (!language) language = this.activeLanguage;
        let finalLanguage:string = language; 
        let finalMessages = { $remote : false } as VoerkaI18nLanguageMessages
        try{
            // 静态加载不是异步块,因此只需要简单的替换即可
            if(language in this.messages && isPlainObject(this.messages[language])) {
                finalMessages = this.messages[language] as VoerkaI18nLanguageMessages;                
            }else{ // 异步加载语言包
                try{
                    const messages = await this._loadLanguageMessages(language)
                    if(messages && isPlainObject(messages)){                        // 语言包加载成功
                        finalMessages = messages   
                        this.messages[language]  = messages                         // 覆盖当前语言包，这样当再次切换时就可以直接使用
                    }else{                    
                        this.logger.warn(`无法加载语言包<${language}>(scope=${this.id}),将回退到默认语言`);
                    }
                }catch(e:any){
                    this.logger.warn(`当加载语言包<${language}>时出错(scope=${this.id}): ${e.message}`);
                }  
            } 
            // 从本地存储中恢复补丁
            this._restorePatchedMessages(finalMessages, language); 
            // 打语言包补丁, 如果是从远程加载语言包则不需要再打补丁了,因为远程加载的语言包已经是补丁过的了
            if(!finalMessages.$remote) {
                await this._patch(finalMessages, language);                    
            }
        }finally{
            this._activeLanguage = finalLanguage            
            this._activeMessages = finalMessages as VoerkaI18nLanguageMessages  
            this._refreshSignal.resolve()
            this._refreshSignal = undefined
            await this.emit('scope/change',finalLanguage,true)               
        }
       
    }
    /**
     * 如果正在刷新语言包，则等待刷新完成
     * @param this 
     * @returns 
     */
    async refreshing(this:VoerkaI18nScope,timeout?:number){
        if(!this._refreshSignal) return
        return  await this._refreshSignal(timeout)
    }
    /**
     * 
     * 加载指定语言的语言包
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
        // if(!this.hasLanguage(language)) throw new InvalidLanguageError(`Not found language <${language}>`)
        // 非默认语言可以是：语言包对象，也可以是一个异步加载语言包文件,加载器是一个异步函数
		// 如果没有加载器，则无法加载语言包，因此回退到默认语言
		let loader = this.messages[language];
        let messages:VoerkaI18nLanguageMessages | undefined = undefined;
        if (isPlainObject(loader)) {                // 静态语言包
            messages = loader as unknown as VoerkaI18nLanguageMessages;
        } else if (isFunction(loader)) {            // 语言包异步chunk            
            const loadResult = (await (loader as any).call(this))          
            if(("__esModule" in loadResult) || (Symbol.toStringTag in loadResult)){
                messages = (loadResult as any).default 
            }else{
                messages = loadResult
            }
        } else if (isFunction(this.languageLoader)) { 
            // 从远程加载语言包:如果该语言没有指定加载器，则使用全局配置的默认加载器
            const loadedMessages = (await this._loadMessagesFromLoader(language)) as unknown as VoerkaI18nDynamicLanguageMessages;
            if(isPlainObject(loadedMessages)){  
                messages = Object.assign(
                    { $remote : true },                     // 添加一个标识，表示该语言包是从远程加载的                     
                    this.messages[this.defaultLanguage], 
                    loadedMessages
                ) as VoerkaI18nLanguageMessages;            // 合并默认语言包和动态语言包,这样就可以局部覆盖默认语言包
                if(loadedMessages.$config){
                    messages.$config = Object.assign({},messages.$config,loadedMessages.$config)
                }
            }
        }else{
            this.logger.error(`没有为<${language}>指定语言包加载器`)
        }
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
        if(isFunction(this.languageLoader)){
            try{
                return await this.languageLoader.call(this,language,this)        
            }catch(e:any){
                this.logger.debug(`从远程加载语言包${language}文件出错:${e.stack}`)
                return {}
            }            
        }
    }

}