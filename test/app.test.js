/**
 * 测试demp app的语言运行环境
 */ 
 const compile = require('../packages/tools/compile.command');
 const path = require("path")
 
 

test("导入多语言包",async ()=>{
    await compile(path.resolve(__dirname,'../packages/demo/apps/app/languages'),{moduleType:"commonjs"})
    const { t,scope,languages } = require(path.join(__dirname,'../packages/demo/apps/app/languages/index.js'));
    expect(t).toBeFunction()
})