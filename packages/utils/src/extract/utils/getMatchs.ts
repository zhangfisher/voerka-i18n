export function getMatchs(code:string,regex:RegExp): string[] | undefined{
    if(!regex) return [code]
    const matched = regex.exec(code) 
    return matched ? (
        matched.length > 1 ? matched.slice(1) : [matched[0]]
    ) : undefined
}
