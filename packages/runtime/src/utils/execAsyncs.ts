/**
 * 异步执行一组Promise，并返回所有Promise的结果
 * 
 * 该函数会处理所有Promise，无论成功或失败都会返回结果。
 * 如果环境支持Promise.allSettled，则直接使用；
 * 否则会手动包装每个Promise，确保不会抛出未捕获的异常。
 * 
 * @template T Promise的返回值类型
 * @param {Promise<T>[]} promises 要执行的Promise数组
 * @returns {Promise<(T | Error)[]>} 返回一个Promise，resolve为包含所有结果的数组，
 *                                   每个元素要么是Promise的返回值，要么是Error对象
 */
export async function execAsyncs<T=any>(promises: Promise<T>[]): Promise<(T | Error)[]> {
    if (typeof Promise.allSettled === 'function') { // 更安全地检查Promise.allSettled是否存在      
        const results = await Promise.allSettled(promises);
        return results.map(result => 
            result.status === 'fulfilled' ? result.value : result.reason
        );
    } else {
        // 先包装每个Promise，统一处理错误
        const wrappedPromises = promises.map(promise =>{
            return new Promise<T | Error>(resolve => {
                Promise.resolve(promise)
                    .then(r => resolve(r))
                    .catch(e => resolve(e instanceof Error ? e : new Error(String(e)))); // 确保错误是Error实例            
            });            
        })
        return await Promise.all(wrappedPromises); 
    }
}