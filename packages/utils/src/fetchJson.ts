
export async function fetchJson<T=any>(urls: string | string[], defaultValue?:T): Promise<T | undefined> {
    if (typeof urls === 'string') {
        urls = [urls];
    }

    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.json() as T;
            }
        } catch (error) {            
        }
    }
    return defaultValue
}