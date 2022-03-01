const gulp = require('gulp');
const extract = require('./extract.plugin');
const path = require('path');


const soucePath = path.join(__dirname,'../demoapps/app')

 

gulp.src([
    soucePath+ '/**',
    "!"+ soucePath+ '/languages/**'
]).pipe(extract({
    debug:true,
    // output: path.join(soucePath , 'languages'),
    languages: [{name:'en',title:"英文"},{name:'cn',title:"中文",default:true},{name:'de',title:"德语"},{name:'jp',title:"日本語"}],
    // extractor:{
    //     default:[new RegExp()],         // 默认匹配器，当文件类型没有对应的提取器时使用
    //     "*" : [new RegExp()],            // 所有类型均会执行的提取器
    //     js:new RegExp(),                 // 只有一个正则表达式,js文件提取正则表达式
    //     html:[new RegExp(),new RegExp()]  // 多个表达式可以用数组
    //     "js,jsx":[new RegExp(),(content,file)=>{...})]  // 提取器也可以是一个函数，传入文件和文件内容，返回提取结果
    // },
    namespaces:{
        "a":"a",
        "b":"b",
    }
}))
.pipe(gulp.dest(path.join(__dirname,'../demoapps/app/languages')));
