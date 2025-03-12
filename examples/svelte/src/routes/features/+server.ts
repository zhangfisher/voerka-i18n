
export function GET({}) {
	const items = [
        "全流程工具链","全自动翻译","多库联动" ,"语言补丁" 
    ]
	return new Response(String(JSON.stringify(items)))
}