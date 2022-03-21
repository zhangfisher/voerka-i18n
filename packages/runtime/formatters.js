/**
 *    内置的格式化器
 * 
 */


/**
 *   字典格式化器
 *   根据输入data的值，返回后续参数匹配的结果
 *   dict(data,<value1>,<result1>,<value2>,<result1>,<value3>,<result1>,...)
 *   
 * 
 *   dict(1,1,"one",2,"two",3,"three"，4,"four") == "one"
 *   dict(2,1,"one",2,"two",3,"three"，4,"four") == "two"
 *   dict(3,1,"one",2,"two",3,"three"，4,"four") == "three"
 *   dict(4,1,"one",2,"two",3,"three"，4,"four") == "four"
 *   // 无匹配时返回原始值
 *   dict(5,1,"one",2,"two",3,"three"，4,"four") == 5  
 *   // 无匹配时并且后续参数个数是奇数，则返回最后一个参数
 *   dict(5,1,"one",2,"two",3,"three"，4,"four","more") == "more"  
 * 
 *   在翻译中使用
 *   I have { value | dict(1,"one",2,"two",3,"three",4,"four")} apples
 * 
 * @param {*} value 
 * @param  {...any} args 
 * @returns 
 */
 function dict(value,...args){
    for(let i=0;i<args.length;i+=2){
        if(args[i]===value){
            return args[i+1]
        }
    }
    if(args.length >0 && (args.length % 2!==0)) return args[args.length-1]
    return value
}

function formatCurrency(value,symbol,retainDots){

}

module.exports = {     
    "*":{
        $types:{
            Date:(value)=>value.toLocaleString()
        },
        time:(value)=>  value.toLocaleTimeString(),  
        shorttime:(value)=>  value.toLocaleTimeString(),  
        date: (value)=> value.toLocaleDateString(),     
        dict,   //字典格式化器
    },   
    cn:{ 
        $types:{
            Date:(value)=> `${value.getFullYear()}年${value.getMonth()+1}月${value.getDate()}日 ${value.getHours()}点${value.getMinutes()}分${value.getSeconds()}秒`
        },
        shortime:(value)=>  value.toLocaleTimeString(),  
        time:(value)=>`${value.getHours()}点${value.getMinutes()}分${value.getSeconds()}秒`,     
        date: (value)=> `${value.getFullYear()}年${value.getMonth()+1}月${value.getDate()}日`,
        shortdate: (value)=> `${value.getFullYear()}-${value.getMonth()+1}-${value.getDate()}`,
        currency:(value)=>`${value}元`,
    },
    en:{
        currency:(value)=>{
            return `$${value}`
        }
    }
}