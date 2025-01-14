let i18nScope,t


try{
    // @voerkai18n/cli工程本身使用了voerkai18n,即@voerkai18n/cli的extract和compile依赖于其自己生成的languages运行时
    // 而@voerkai18n/cli又用来编译多语言包，这样产生了鸡生蛋问题
    // extract与compile调试阶段如果t函数无法使用(即编译的languages无法正常使用)，则需要提供t函数
    const language = require('../../languages'); 
    t = language.t
    i18nScope = language.i18nScope
}catch(e){
    t=(v:string)=>v
    i18nScope={change:()=>{} }
}


export { 
    i18nScope,
    t
}


