const { objectStringify }   = require("@voerkai18n/cli/stringify")
const path = require("path");
const fs = require("fs");

const k1 = "产品清单\t{}"
const k2 = "产品\\清\\单"

const newTexts = {
    [k1]:1,
    [k2]:2
}

let data = {
    name:"张三丰",  
    age:12,
    active:true,
    address:[
        "北京市",
        "福建省泉州市\n洛阳镇"
    ],
    posts:{
        title:"标题",
        content:"内容",
        //comments:[]
    },
    [k1]:[
        "手机",
        "电脑"
    ],
    "产品清单\t{}":2,
    "产品价格":{
        "手机":1299,
        "电脑\t:":3999
    },
    "产品\\清\\单":1
}
 

const result = objectStringify(data) 

console.log(result)

fs.writeFileSync(path.join(__dirname,"./data.js"),`module.exports = ${result}`)

const loaded = require("./data.js")

Object.entries(loaded).forEach(([key,value])=>{
    if(key===k1){
        console.log("k1=",value)
    }else if(key===k2){
        console.log("k2=",value)
        console.log("k2 in data",k2 in data)
    }
})

console.log(loaded[k1])
console.log(loaded[k2])


