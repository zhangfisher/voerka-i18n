/**
 * 将值转换为Date类型
 * @param {*} value  
 */
export  function toDate(value:any):Date{ 
    return value instanceof Date ? value : new Date(value)
}
