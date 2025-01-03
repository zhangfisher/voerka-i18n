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
import { VoerkaI18nChangeLanguageError, VoerkaI18nError, VoerkaI18nInvalidLanguageError, VoerkaI18nLoadLanguageError } from "@/errors";



export class ChangeLanguageMixin{     
    protected _refreshSignal? :IAsyncSignal 
    /** 
     * 刷新语言包 
     * @param language 
     */
    async refresh(this:VoerkaI18nScope,language?:string,options?:{fallback?:boolean,patch:boolean}){
        if(!this._refreshSignal) this._refreshSignal = asyncSignal() 
        if (!language) language   = this.activeLanguage;        
        let finalLanguage: string = language; 
        let finalMessages         = { $remote : false } as VoerkaI18nLanguageMessages
        const {patch:enablePatch,fallback} = Object.assign({
            fallback:false,
            patch:true},options)
        try{
            // 静态加载不是异步块,因此只需要简单的替换即可
            if(language in this.messages && isPlainObject(this.messages[language])) {
                finalMessages = this.messages[language] as VoerkaI18nLanguageMessages;                
            }else if(isFunction(this.loader)){ // 异步加载语言包
                try{
                    const messages = await this._loadLanguageFromRemote(language)
                    if(messages && isPlainObject(messages)){                        // 语言包加载成功
                        finalMessages = messages   
                        this.messages[language]  = messages                         // 覆盖当前语言包，这样当再次切换时就可以直接使用
                    }else{                    
                        this.logger.warn(`无法加载语言包<${language}>(scope=${this.id}),将回退到默认语言`);
                        throw new VoerkaI18nLoadLanguageError()
                    }
                }catch(e:any){
                    this.logger.warn(`当加载语言包<${language}>时出错(scope=${this.id}): ${e.message}`);
                    throw new VoerkaI18nLoadLanguageError(e.message)
                }  
            }else{
                throw new VoerkaI18nInvalidLanguageError(language)
            } 
            this._activeMessages = finalMessages as VoerkaI18nLanguageMessages
            // 打语言包补丁, 如果是从远程加载语言包则不需要再打补丁了,因为远程加载的语言包已经是补丁过的了            
            if(!finalMessages.$remote && enablePatch) {
                await this.patch(language);
            }
        }catch(e:any){
            // 切换语言失败，回退到默认语言
            if(e && e instanceof VoerkaI18nError){
                const finalLanguage = this.getFallbackLanguage(language)
                
            }
        }finally{
            this._activeLanguage = finalLanguage
            this._refreshSignal.resolve()
            this._refreshSignal = undefined
            await this.emit('scope/change',finalLanguage,true)
        }
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
    private async _loadLanguageFromRemote(this:VoerkaI18nScope,language:string):Promise<VoerkaI18nLanguageMessages | undefined>{
        this.logger.debug(`准备加载语言包:${language}`)
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
        } else if (isFunction(this.loader)) { 
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
        if(isFunction(this.loader)){
            try{
                return await this.loader.call(this,language,this)        
            }catch(e:any){
                this.logger.debug(`从远程加载语言包${language}文件出错:${e.stack}`)
                return {}
            }            
        }
    }

    /**
     * 如果正在刷新语言包，则等待刷新完成
     * @param this 
     * @returns 
     */
    async ready(this:VoerkaI18nScope,timeout?:number){
        if(!this._refreshSignal && !this._patching) return        
        await Promise.all([this._refreshSignal?.(timeout), this._patching?.(timeout)])
    }
}