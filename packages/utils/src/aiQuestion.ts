
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
    try {
        const res = await fetch(apiUrl,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${apiKey}`,
                "Cache-Control": "no-cache" // 禁用缓存
            },
            body:JSON.stringify(request)
        })

        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`)
        }

        const data = await res.json() as AiResponse
        const result = removeCodeBlock(data.choices[0].message.content.trim()) as T
        return result

    } catch (err) {
        const error = err as AiError
        console.error('Error in aiQuestion:', error)
        throw new Error(`Failed to get AI response: ${error.message}`)
    }
}


// async function test(){
//     const code= `
//         const answer = "今天天气如何"
//         console.log("今天天气如何","泉州天气晴朗")
//         console.log(answer)        
    
//     `
//     const answer = await aiQuestion(`
//         以下这是一个javascript/typescript/tsx/jsx/vue/astro代码块，将里面的所有字符串字面量均使用t()函数进行国际化处理，要求如下：
//         - 将所有字符串字面量替换为t()函数
//         - 例如将"hello"转换为t('hello')
//         - 忽略注释中的字符串
//         - 如果字符串已经使用了t()函数，则不要重复处理        
//         - 
        
//         ${code}
//     `, {
//         apiUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
//         model: "glm-4-flash",
//         apiKey: "b84b4e14442345c0bf78d9e7d13a826b.863QzZmtpccPPEcH"
//     });
//     console.log(answer)
// }
// test().then(()=>console.log("done")).catch(console.error)