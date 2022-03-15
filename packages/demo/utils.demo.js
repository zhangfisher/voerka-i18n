const objectToString   = require("../tools/stringify")
const path = require("path");
const fs = require("fs");

const k1 = "产品清单\t{}"
const k2 = "产品\\清单"
const data = {
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
    "产品价格":{
        "手机":1299,
        "电脑":3999
    },
    [k2]:1
}

const result = objectToString(data)

console.log(result)

fs.writeFileSync(path.join(__dirname,"./data.js"),`module.exports = ${result}`)

const loaded = require("./data.js")

console.log(loaded[k1])
console.log(loaded[k2])


