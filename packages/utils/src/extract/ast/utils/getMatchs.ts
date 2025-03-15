export function getMatchs(code:string,regex:RegExp): string[] | undefined{
    if(!regex) return [code]

    let results:string[] = []
    let matched;

    while ((matched = regex.exec(code)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (matched.index === regex.lastIndex) {
            regex.lastIndex++;
        }        
        // The result can be accessed through the `m`-variable.
        const match = matched ? (
                     matched.length > 1 ? matched[1] : matched[0]
        ) : undefined
        if(match) results.push(match) 
    }

    return results
}



// export function getMatchs(code:string,regex:RegExp): string[] | undefined{
//     if(!regex) return [code]
//     const matched = regex.exec(code) 
//     return matched ? (
//         matched.length > 1 ? matched.slice(1) : [matched[0]]
//     ) : undefined
// }
