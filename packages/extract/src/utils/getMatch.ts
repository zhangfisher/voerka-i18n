export function getMatch(code:string,regex:RegExp): string | undefined{
    const match = regex.exec(code)
    return match ? (
        match.length > 0 ? match[1] : match[0] 
    ) : undefined
}
