const { objectToString }   = require("../tools/stringify")
const path = require("path");
const fs = require("fs");


const data = {
    name:"张三丰",  
    age:12,
    active:true,
    address:[
        "北京市",
        "福建省泉州市"
    ],
    posts:{
        title:"标题",
        content:"内容",
        //comments:[]
    },
    "产品清单":[
        "手机",
        "电脑"
    ]
}

const result = objectToString(data)

console.log(result)

