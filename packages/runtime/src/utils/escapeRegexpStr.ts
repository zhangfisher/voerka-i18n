
 /**
  * 当需要采用正则表达式进行字符串替换时，需要对字符串进行转义
  * 
  * 比如  str = "I am {username}"  
  * replace(new RegExp(str),"Tom") !===  I am Tom
  * 
  * 因为{}是正则表达式元字符，需要转义成 "\{username\}"
  * 
  * replace(new RegExp(escapeRegexpStr(str)),"Tom")
  * 
  * 
  * @param {*} str 
  * @returns 
  */
 export function escapeRegexpStr(str:string):string{
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
} 
