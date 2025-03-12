import axios from 'axios';


export async function fetchJson<T=any>(urls: string | string[], defaultValue?: T): Promise<T | undefined> {
    if (typeof urls === 'string') {
        urls = [urls];
    }
    for (const url of urls) {
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                return JSON.parse(response.data) as T;
            }
        } catch (error) {            
        }
    }
    return defaultValue;
}