import axios from 'axios';


export type AiRole = {
    role: string
    content: string
}
export interface AiQuestionOptions {
    model?: string
    temperature?: number
    apiUrl: string
    apiKey: string
    roles?: AiRole[]
}

export interface AiResponse {
    choices: {
        message: {
            content: string
        }
    }[]
}

export type AiError = Error & {
    response?: Response
    data?: any
}

/**
 * 输入一个代码块，返回代码块中的所有字符串字面量
 * @param text 
 */
function removeCodeBlock(text:string){
    return text.replace(/^```\w?.*?[\n\r]+/gm,"")
                    .replace(/```\s*$/gm,"")
}

/**
 * 
 * 向AI提问并返回结果
 * 
 * 目标AI大模型的API是OpenAI兼容的接口，可以使用OpenAI的API Key
 * 
 * 如:
 * 
 * ```ts
 * const answer = await aiQuestion("今天天气如何",{
 *    apiUrl:"https://api.deepseek.ai",
 *    model:"gpt-3.5-turbo",
 *    apiKey:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
 * })
 * 
 * 
 * @param prompt 
 * @param options 
 */
export async function  aiQuestion<T=string>(prompt:string,options?:AiQuestionOptions):Promise<T>{
    const { apiUrl,apiKey,temperature,model,roles } = Object.assign({
        temperature:1,
        roles:[]
    },options)

    const request = {
        messages:[
            {
                role:"user",
                content:prompt
            },
            ...roles
        ],        
        model,
        temperature
    }
    // 使用fetch向API发送请求
    let data:any 
    try{
        const res = await axios.post(apiUrl, request, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "Cache-Control": "no-cache"
            }
        });
        if (res.status !== 200) {
            throw new Error(`API request failed with status ${res.status}: ${res.statusText}`);
        }
        data = res.data;
        const result = removeCodeBlock(data.choices[0].message.content.trim()) as T;
        return result;

    } catch (err:any) {
        throw new Error(`Error when calling AI api: ${err.message}`)
    }
}
