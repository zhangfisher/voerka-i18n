/**
 *    内置的格式化器
 * 
 */


module.exports = {     
    "*":{
        $types:{
            Date:(value)=>value.toLocaleString()
        },
        time:(value)=>  value.toLocaleTimeString(),  
        date: (value)=> value.toLocaleDateString(),       
    },   
    cn:{ 
        $types:{
            Date:(value)=> `${value.getFullYear()}年${value.getMonth()+1}月${value.getDate()}日 ${value.getHours()}点${value.getMinutes()}分${value.getSeconds()}秒`
        },
        time:(value)=>`${value.getHours()}点${value.getMinutes()}分${value.getSeconds()}秒`,     
        date: (value)=> `${value.getFullYear()}年${value.getMonth()+1}月${value.getDate()}日`,
        currency:(value)=>`${value}元`,
    },
    en:{
        currency:(value)=>`$${value}`,       
    }
}