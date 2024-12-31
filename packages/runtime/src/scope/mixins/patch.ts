import type { VoerkaI18nLanguageMessages } from "@/types";
import type { VoerkaI18nScope } from "..";
import { isFunction  } from "flex-tools/typecheck/isFunction";
import { isPlainObject } from "flex-tools/typecheck/isPlainObject";

/**
 * 语言包补丁
 * 
 */
export class PatchMessageMixin{    
    /**
     * 清除保存在本地的补丁语言包
     * @param language 
     */
    clearPatchedMessages(this:VoerkaI18nScope,language?:string) {
        if(this.manager.storage){
            let langs = language ? [language] : this.languages.map(l=>l.name);
            for(let lang of langs){
                this.manager.storage.remove(`voerkai18n_${this.id}_${lang}_patched_messages`);
            }
        }
    }
	/**
	 * 当指定了默认语言包加载器后，会从服务加载语言补丁包来更新本地的语言包
	 *
	 * 补丁包会自动存储到本地的LocalStorage中
	 *
	 * @param {*} messages
	 * @param {*} language
	 * @returns {Promise<number>} 返回补丁包的数量
	 */
	protected async _patch(this:VoerkaI18nScope,messages:VoerkaI18nLanguageMessages, language:string):Promise<number> {
		if (!isFunction(this.manager.defaultMessageLoader)) return 0;
		try {
			const pachedMessages = (await this.manager._loadMessagesFromDefaultLoader(language,this)) as unknown as VoerkaI18nLanguageMessages;
			if (isPlainObject(pachedMessages)) {
				Object.assign(messages, pachedMessages);
				this._savePatchedMessages(pachedMessages, language);
                this.manager.emit('patched',{language:language,scope:this.id})
				const count = Object.keys(pachedMessages).length;
                this.logger.debug(`已更新了语言补丁包<${language}>(scope=${this.id}),共${count}条`);
				return count
			}
		} catch (e:any) {
			this.logger.error(`当从远程加载语言补丁包<${language}>时出错:${e.stack}(scope=${this})`);
		}		
		return 0
	}
	/**
	 * 从本地存储中读取语言包补丁合并到当前语言包中
	 */
	protected _restorePatchedMessages(this:VoerkaI18nScope,messages:VoerkaI18nLanguageMessages,language:string) {
		let patchedMessages = this._getPatchedMessages(language);
		if (isPlainObject(patchedMessages)) {
            Object.assign(messages, patchedMessages);
            this.manager.emit('restore',{language,scope:this.id})
            this.logger.debug(`成功恢复补丁语言包<${language}>(scope=${this.id})`);
		}
	}
	/**
	 * 将读取的补丁包保存到本地的LocalStorage中
	 *
	 * 为什么要保存到本地的LocalStorage中？
	 *
	 * 因为默认语言是静态嵌入到源码中的，而加载语言包补丁是延后异步的，
	 * 当应用启动第一次就会渲染出来的是没有打过补丁的内容。
	 *
	 * - 如果还需要等待从服务器加载语言补丁合并后再渲染会影响速度
	 * - 如果不等待从服务器加载语言补丁就渲染，则会先显示未打补丁的内容，然后在打完补丁后再对应用进行重新渲染生效
	 *   这明显不是个好的方式
	 *
	 * 因此，采用的方式是：
	 * - 加载语言包补丁后，将之保存到到本地的LocalStorage中
	 * - 当应用加载时会查询是否存在补丁，如果存在就会合并渲染
	 *
	 * @param {*} messages
	 */
	protected _savePatchedMessages(this:VoerkaI18nScope,messages:VoerkaI18nLanguageMessages, language:string) {
        if(!this.manager.storage) return 
		try {
            this.manager.storage.set(`voerkai18n_${this.id}_${language}_patched_messages`,JSON.stringify(messages));
		} catch (e:any) {
			this.logger.error(`保存语言包补丁(${language})时出错:${e.stack}(scope=${this.id})`);
		}
	}
	/**
	 * 从本地缓存中读取补丁语言包
	 * @param {*} language
	 * @returns
	 */
	protected _getPatchedMessages(this:VoerkaI18nScope,language:string) {
		try {
            if(this.manager.storage){
                return this.manager.storage.get(`voerkai18n_${this.id}_${language}_patched_messages`) || {};
            }else{
                return {};
            }
		} catch (e:any) {
            this.logger.error(`读取语言包补丁(${language})时出错:${e.stack}(scope=${this.id})`);
			return {};
		}
	}
}