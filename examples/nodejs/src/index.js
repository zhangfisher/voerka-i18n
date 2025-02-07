const { t,i18nScope } = require("./languages"); 

async function main(){
    console.log(`-------------${i18nScope.activeLanguage}-----------------`)

    console.log(t('这是一个测试'));
    console.log(t('你好'));
    console.log(t('我叫{name},今年{age}岁', { name: '张三', age: 12 }));
    console.log(t('我有{}部车', 0));
    console.log(t('我有{}部车', 1));
    console.log(t('我有{}部车', 2));
    console.log(t('我有{}部车', 3));
    console.log(t('我有{}部车', 100));
    console.log(t('我有{count}部车', { count: 3 }));
    console.log(t('我有{count}部车', { count: () => 3 }));
    console.log(t('现在是{|date}', Date.now())); 
    console.log(t('今天天气{condition}', { condition: '晴天' })); 
    
    await i18nScope.change("en-US")
    console.log(`-------------${i18nScope.activeLanguage}-----------------`)

    console.log(t('这是一个测试'));
    console.log(t('你好'));
    console.log(t('我叫{name},今年{age}岁', { name: '张三', age: 12 }));
    console.log(t('我有{}部车', 0));
    console.log(t('我有{}部车', 1));
    console.log(t('我有{}部车', 2));
    console.log(t('我有{}部车', 3));
    console.log(t('我有{}部车', 100));
    console.log(t('我有{count}部车', { count: 3 }));
    console.log(t('我有{count}部车', { count: () => 3 }));
    console.log(t('现在是{|date}', Date.now())); 
    console.log(t('今天天气{condition}', { condition: '晴天' })); 
}


main().then(()=>{
    console.log("done")
}).catch((err)=>{
    console.error(err)
})
