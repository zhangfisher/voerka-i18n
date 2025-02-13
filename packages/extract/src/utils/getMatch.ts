export function getMatch(code:string,regex:RegExp): string | undefined{
    const match = code.match(regex)
    return match ? match[1] : undefined
}
