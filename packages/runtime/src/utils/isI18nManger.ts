
/**
 * 判断给定对象是否为管理者对象。
 * 管理者对象需满足以下条件：
 * 1. 是一个对象。
 * 2. 具有 `__VOERKAI18N_MANAGER__` 属性。
 * 
 * 为什么不用 `instanceof` 运算符？
 * 
 * 为了兼容让scope可以注册到不同版本的VoerkaI18nManager中，不能使用instanceof运算符。
 * 
 * 
 * @param obj 要检查的对象
 * @returns 如果对象是管理者对象，则返回 true；否则返回 false。
 */
export function isI18nManger(obj: any) {
    return obj && typeof (obj) === 'object' && obj.__VoerkaI18nManager__
}