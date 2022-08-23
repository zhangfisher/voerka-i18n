const {i18nScope, translate, getInterpolatedVars }  = require('../packages/runtime/dist/runtime.cjs')
const dayjs = require('dayjs');

function toLanguageDict(values,startIndex=0){
    return values.reduce((result,curValue,i)=>{
        result[i+startIndex] = curValue;
        return result
    },{})
}
function toLanguageIdMap(values,startIndex=0){
    return values.reduce((result,curValue,i)=>{
        result[curValue] = i+startIndex
        return result
    },{})
}
// 显示两个数组哪一行不同
function diffArray(arr1,arr2){
    let diffs = []
    arr1.forEach((v,i)=>{
        if(v!=arr2[i]) diffs.push([i,[v,arr2[i]]])
    })
    return diffs
 }


const NOW =  new Date("2022/08/12 10:12:36")

const zhDatetimes =[
    "现在是{ value }",
    "现在是{ value | date }",
    "现在是{ value | date('local') }",
    "现在是{ value | date('long') }",
    "现在是{ value | date('short') }",    
    "现在是{ value | date('iso') }",
    "现在是{ value | date('gmt') }",
    "现在是{ value | date('utc') }",
    "现在是{ value | date('YYYY-MM-DD HH:mm:ss')}",
    "现在是{ value | date('YYYY-MM-DD')}",
    "现在是{ value | date('HH:mm:ss')}",
    "现在是{ value | month }",
    "现在是{ value | month('long')}",
    "现在是{ value | month('short')}",
    "现在是{ value | month('number')}",
    "现在是{ value | weekday }",
    "现在是{ value | weekday('long')}",
    "现在是{ value | weekday('short')}",
    "现在是{ value | weekday('number')}",
    "现在是{ value | quarter }",
    "现在是{ value | quarter('long')}",
    "现在是{ value | quarter('short')}",
    "现在是{ value | quarter('number')}",

    // 时间
    "现在时间 - { value | time }",
    "现在时间 - { value | time('local') }",
    "现在时间 - { value | time('long') }",
    "现在时间 - { value | time('short') }",
    "现在时间 - { value | time('timestamp') }",    
    "现在时间 - { value | time('HH:mm:ss') }",
    "现在时间 - { value | time('mm:ss') }",
    "现在时间 - { value | time('ss') }"
]
//

const expectZhDatetimes =[
    "现在是2022/8/12 10:12:36",		                    // { value }
    "现在是2022/8/12 10:12:36",		                    // { value | date }
    `现在是${NOW.toLocaleString()}`,                    // { value | date('local') }
    "现在是2022年08月12日 10点12分36秒",                 // { value | date('long') }
	"现在是2022/08/12",		                            // { value | date('short') }
	`现在是${NOW.toISOString()}`,	    	            // { value | date('iso') }
	`现在是${NOW.toGMTString()}`,		                // { value | date('gmt') }
	`现在是${NOW.toUTCString()}`,		                // { value | date('utc') }
	"现在是2022-08-12 10:12:36",		                // { value | date('YYYY-MM-DD HH:mm:ss')}
	"现在是2022-08-12",		                            // { value | date('YYYY-MM-DD')}
	"现在是10:12:36",		                            // { value | date('HH:mm:ss')}
	"现在是八月",		                                // { value | month }
	"现在是八月",		                                // { value | month('long')}
	"现在是8月",		                                // { value | month('short')}
	"现在是8",		                                    // { value | month('number')}
	"现在是星期五",		                                // { value | weekday }
	"现在是星期五",		                                // { value | weekday('long')}
	"现在是周五",		                                // { value | weekday('short')}
	"现在是5",		                                    // { value | weekday('number')}
    "现在是Q3",		                                    // { value | quarter }
	"现在是三季度",		                                // { value | quarter('long')}
	"现在是Q3",		                                    // { value | quarter('short')}
	"现在是3",		                                    // { value | quarter('number')}

    // 时间
	`现在时间 - ${NOW.toLocaleTimeString()}`,          // { value | time }
	`现在时间 - ${NOW.toLocaleTimeString()}`,          // { value | time('local') }
    "现在时间 - 10点12分36秒",		                   // { value | time('long') }
	"现在时间 - 10:12:36",		                       // { value | time('short') }
	"现在时间 - 1660270356000",		                   // { value | time('timestamp') }
	"现在时间 - 10:12:36",		                       // { value | time('HH:mm:ss') }
	"现在时间 - 12:36",		                           // { value | time('mm:ss') }
	"现在时间 - 36",		                           // { value | time('ss') }"
]
 

const enDatetimes =[
    "Now is { value }",
    "Now is { value | date }",
    "Now is { value | date('local') }",
    "Now is { value | date('long') }",
    "Now is { value | date('short') }",    
    "Now is { value | date('iso') }",
    "Now is { value | date('gmt') }",
    "Now is { value | date('utc') }",
    "Now is { value | date('YYYY-MM-DD HH:mm:ss')}",
    "Now is { value | date('YYYY-MM-DD')}",
    "Now is { value | date('HH:mm:ss')}",
    "Now is { value | month }",
    "Now is { value | month('long')}",
    "Now is { value | month('short')}",
    "Now is { value | month('number')}",
    "Now is { value | weekday }",
    "Now is { value | weekday('long')}",
    "Now is { value | weekday('short')}",
    "Now is { value | weekday('number')}",
    "Now is { value | quarter }",
    "Now is { value | quarter('long')}",
    "Now is { value | quarter('short')}",
    "Now is { value | quarter('number')}",
    // 时间
    "Now time: { value | time }",
    "Now time: { value | time('local') }",
    "Now time: { value | time('long') }",
    "Now time: { value | time('short') }",
    "Now time: { value | time('timestamp') }",    
    "Now time: { value | time('HH:mm:ss') }",
    "Now time: { value | time('mm:ss') }",
    "Now time: { value | time('ss') }"
]

const expectEnDatetimes =[
    "Now is 2022/8/12 10:12:36",		                // { value }
    "Now is 2022/8/12 10:12:36",		                // { value | date }
    `Now is ${NOW.toLocaleString()}`,		            // { value | date('local') }
    "Now is 2022/08/12 10:12:36",		                // { value | date('long') }
	"Now is 2022/08/12",		                        // { value | date('short') }	
	`Now is ${NOW.toISOString()}`,		                // { value | date('iso') }
	`Now is ${NOW.toGMTString()}`,		                // { value | date('gmt') }
	`Now is ${NOW.toUTCString()}`,		                // { value | date('utc') }
	"Now is 2022-08-12 10:12:36",		                // { value | date('YYYY-MM-DD HH:mm:ss')}
	"Now is 2022-08-12",		                        // { value | date('YYYY-MM-DD')}
	"Now is 10:12:36",		                            // { value | date('HH:mm:ss')}
	"Now is August",		                            // { value | month }
	"Now is August",		                            // { value | month('long')}
	"Now is Aug",		                                // { value | month('short')}
	"Now is 8",		                                    // { value | month('number')}
	"Now is Friday",		                            // { value | weekday }
	"Now is Friday",		                            // { value | weekday('long')}
	"Now is Fri",		                                // { value | weekday('short')}
	"Now is 5",		                                    // { value | weekday('number')}
    "Now is Q3",		                                // { value | quarter }
	"Now is Third Quarter",		                        // { value | quarter('long')}
	"Now is Q3",		                                // { value | quarter('short')}
	"Now is 3",		                                    // { value | quarter('number')}
    

    // 时间
    `Now time: ${NOW.toLocaleTimeString()}`,            // { value | time }
	`Now time: ${NOW.toLocaleTimeString()}`,		    // { value | time('local') }
	"Now time: 10:12:36",		                        // { value | time('long') }
	"Now time: 10:12:36",		                        // { value | time('short') }
	"Now time: 1660270356000",		                    // { value | time('timestamp') }
	"Now time: 10:12:36",		                        // { value | time('HH:mm:ss') }
	"Now time: 12:36",		                            // { value | time('mm:ss') }
	"Now time: 36",		                                // { value | time('ss') }"
]

const MONEY = 123456789.88
const zhMoneys = [
    "商品价格: { value | currency}",                           // 默认格式    
    // long
    "商品价格: { value | currency('long')}",                   // 长格式
    "商品价格: { value | currency('long',1)}",                 // 长格式: 万元
    "商品价格: { value | currency('long',2)}",                 // 长格式: 亿
    "商品价格: { value | currency('long',3)}",                 // 长格式: 万亿
    "商品价格: { value | currency('long',4)}",                 // 长格式: 万万亿
    // short
    "商品价格: { value | currency('short')}",                   // 短格式
    "商品价格: { value | currency('short',1)}",                 // 短格式 Thousands
    "商品价格: { value | currency('short',2)}",                 // 短格式 Millions
    "商品价格: { value | currency('short',3)}",                 // 短格式 Billions
    "商品价格: { value | currency('short',4)}",                 // 短格式 Trillions
    
    // 自定义货币格式
    "商品价格: { value | currency({symbol:'￥￥'})}",  
    "商品价格: { value | currency({symbol:'￥￥',prefix:'人民币:'})}",  
    "商品价格: { value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整'})}",    
    "商品价格: { value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2})}",
    "商品价格: { value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2,precision:4})}",
    "商品价格: { value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2,precision:4,format:'{prefix}*{symbol}*{value}*{unit}*{suffix}'})}"
    
]

const expectZhMoneys =[
    "商品价格: ￥1,2345,6789.88",                                // { value | currency }         
    // long                 
    "商品价格: RMB ￥1,2345,6789.88元",                          // { value | currency('long')}
    "商品价格: RMB ￥1,2345.678988万元",                         // { value | currency('long',1)}
    "商品价格: RMB ￥1.2345678988亿元",                          // { value | currency('long',2)}
    "商品价格: RMB ￥0.00012345678988万亿元",                    // { value | currency('long',3)}
    "商品价格: RMB ￥0.000000012345678988万万亿元",              // { value | currency('long',4)}    
    // short
    "商品价格: ￥1,2345,6789.88",                                // { value | currency('short')}
    "商品价格: ￥1,2345.678988万",                               // { value | currency('short',1)}
    "商品价格: ￥1.2345678988亿",                                // { value | currency('short',2)}
    "商品价格: ￥0.00012345678988万亿",                          // { value | currency('short',3)}
    "商品价格: ￥0.000000012345678988万万亿",                    // { value | currency('short',4)}
    // 自定义货币格式
    "商品价格: RMB ￥￥1,2345,6789.88元",  
    "商品价格: 人民币: ￥￥1,2345,6789.88元",  
    "商品价格: 人民币: ￥￥1,2345,6789.88元整",  
    "商品价格: 人民币: ￥￥1.2345678988亿元整",  
    "商品价格: 人民币: ￥￥1.2346+亿元整",
    "商品价格: 人民币:*￥￥*1.2346+*亿*元整"      
]



const enMoneys = [
    "Price: { value | currency }",                           // 默认格式    
    // long
    "Price: { value | currency('long') }",                   // 长格式
    "Price: { value | currency('long',1) }",                 // 长格式: 万元
    "Price: { value | currency('long',2) }",                 // 长格式: 亿
    "Price: { value | currency('long',3) }",                 // 长格式: 万亿
    "Price: { value | currency('long',4) }",                 // 长格式: 万万亿
    // short
    "Price: { value | currency('short') }",                   // 短格式
    "Price: { value | currency('short',1) }",                 // 短格式 Thousands
    "Price: { value | currency('short',2) }",                 // 短格式 Millions
    "Price: { value | currency('short',3) }",                 // 短格式 Billions
    "Price: { value | currency('short',4) }",                 // 短格式 Trillions
]
const expectEnMoneys =[
    "Price: $123,456,789.88",                                   // { value | currency }         
    // long                 
    "Price: USD $123,456,789.88",                               // { value | currency('long')}
    "Price: USD $123,456.78988 thousands",                      // { value | currency('long',1)}
    "Price: USD $123.45678988 millions",                        // { value | currency('long',2)}
    "Price: USD $0.12345678988 billions",                       // { value | currency('long',3)}
    "Price: USD $0.00012345678988 trillions",                   // { value | currency('long',4)}    
    // short
    "Price: $123,456,789.88",                                   // { value | currency('short')}
    "Price: $123,456.78988 thousands",                          // { value | currency('short',1)}
    "Price: $123.45678988 millions",                            // { value | currency('short',2)}
    "Price: $0.12345678988 billions",                           // { value | currency('short',3)}
    "Price: $0.00012345678988 trillions",                       // { value | currency('short',4)}
]



const loaders = {
    zh:{
        1:"你好",
        2:"现在是{ value | }",
        3:"我出生于{year}年，今年{age}岁",
        4:"我有{}个朋友",
        ...toLanguageDict(zhDatetimes,5),        
    },
    en :{
        1:"hello",
        2:"Now is {}",
        3:"I was born in {year}, now is {age} years old",
        4:["I have no friends","I have one friends","I have two friends","I have {} friends"],
        ...toLanguageDict(enDatetimes,5),    
    }
}


const formatters = {
    zh:{
        $config:{},
        $types:{},
        book:(v)=>`《${v}》`,
    },
    en:{
        $config:{},
        $types:{ },
        book:(v)=>`<${v}>`,
    },
}

const idMap = {
    "你好":1,
    "现在是{ value | }":2,
    "我出生于{year}年，今年{age}岁":3,
    "我有{}个朋友":4,
    ...toLanguageIdMap(zhDatetimes,5)
}
const languages = [
    { name: "zh", title: "中文" },
    { name: "en", title: "英文" },
    { name: "de", title: "德语" },
    { name: "jp", title: "日语" }
] 


const scope = new i18nScope({
    id             : "test",
    defaultLanguage: "zh",
    activeLanguage : "zh",
    namespaces     : {},    
    default        : loaders.zh,                        // 默认语言包
    messages       : loaders.zh,                        // 当前语言包
    languages,                                          // 语言配置
    idMap,                                              // 消息id映射列表    
    formatters,                                         // 扩展自定义格式化器    
    loaders                                             // 语言包加载器
})


const t = translate.bind(scope) 

// 适用于所有语言的格式化器，并且注册到全局
scope.registerFormatters({
    "*":{
        sum   : (v,n=1)=>v+n,
        double: (v)=>v*2,
        upper : (v)=>v.toUpperCase()
    }
},true)


  

describe("翻译函数",()=>{
    beforeEach(() => {
        scope.change("zh")
    });
test("获取翻译内容中的插值变量",done=>{
    const results = getInterpolatedVars("中华人民共和国成立于{date | year(1,2) | time('a','b') | rel }年,首都是{city}市");
    expect(results.length).toEqual(2);
    // 
    expect(results[0].name).toEqual("date");
    expect(results[0].formatters.length).toEqual(3);
    // year(1,2)
    expect(results[0].formatters[0].name).toEqual("year");
    expect(results[0].formatters[0].args).toEqual([1,2]);
    // time('a','b')
    expect(results[0].formatters[1].name).toEqual("time");
    expect(results[0].formatters[1].args).toEqual(["a","b"]);    
    // rel
    expect(results[0].formatters[2].name).toEqual("rel");
    expect(results[0].formatters[2].args).toEqual([]);
    
    expect(results[1].name).toEqual("city");
    expect(results[1].formatters.length).toEqual(0);

    done()
})

test("获取翻译内容中定义了重复的插值变量",done=>{
    const results = getInterpolatedVars("{a}{a}{a|x}{a|x}{a|x|y}{a|x|y}");
    expect(results.length).toEqual(3);
    expect(results[0].name).toEqual("a");
    expect(results[0].formatters.length).toEqual(0);
    
    expect(results[1].name).toEqual("a");
    expect(results[1].formatters.length).toEqual(1);
    expect(results[1].formatters[0].name).toEqual("x");
    expect(results[1].formatters[0].args).toEqual([]);

    expect(results[2].name).toEqual("a");
    expect(results[2].formatters.length).toEqual(2);
    expect(results[2].formatters[0].name).toEqual("x");
    expect(results[2].formatters[0].args).toEqual([]);
    expect(results[2].formatters[1].name).toEqual("y");
    expect(results[2].formatters[1].args).toEqual([]);
    
    done()
})

test("替换翻译内容的位置插值变量",done=>{   
    expect(t("{}{}{}",1,2,3)).toBe("123");
    expect(t("{a}{b}{c}",1,2,3)).toBe("123");
    // 定义了一些无效的格式化器，直接忽略
    expect(t("{a|xxx}{b|dd}{c|}",1,2,3)).toBe("123");
    expect(t("{a|xxx}{b|dd}{c|}",1,2,3,4,5,6)).toBe("123");
    expect(t("{ a|}{b|dd}{c|}{}",1,2,3)).toBe("123{}");
    // 中文状态下true和false被转换成中文的"是"和"否"
    expect(t("{}{}{}",1,"2",true)).toBe("12是");
    expect(t("{|double}{}{}",1,"2",true)).toBe("22是");
    done()
})

test("替换翻译内容的命名插值变量",done=>{    
    expect(t("{a}{b}{c}",{a:11,b:22,c:33})).toBe("112233"); 
    expect(t("{a}{b}{c}{a}{b}{c}",{a:1,b:"2",c:3})).toBe("123123");
    done()
})

test("命名插值变量使用格式化器",done=>{    
  // 提供无效的格式化器，直接忽略
  expect(t("{a|x}{b|x|y}{c|}",{a:1,b:2,c:3})).toBe("123"); 
  expect(t("{a|x}{b|x|y}{c|double}",{a:1,b:2,c:3})).toBe("126");   
  // padStart和trim格式化器只是字符串的原型方法，不需要额外定义可以直接使用
  expect(t("{a|padStart(10)}",{a:"123"})).toBe("       123"); 
  expect(t("{a|padStart(10)|trim}",{a:"123"})).toBe("123"); 
  done()
})


test("命名插值变量使用格式化器",done=>{    
    // 提供无效的格式化器，直接忽略
    expect(t("{a|x}{b|x|y}{c|}",{a:1,b:2,c:3})).toBe("123"); 
    expect(t("{a|x}{b|x|y}{c|double}",{a:1,b:2,c:3})).toBe("126");   
    // 默认的字符串格式化器，不需要定义使用字符串方法
    expect(t("{a|x}{b|x|y}{c|double}",{a:1,b:2,c:3})).toBe("126");   
    expect(t("{a|padStart(10)}",{a:"123"})).toBe("       123"); 
    expect(t("{a|padStart(10)|trim}",{a:"123"})).toBe("123"); 
    done()
  })


  
test("切换到其他语言时的自动匹配同名格式化器",async ()=>{    
    expect(t("{a}",{a:true})).toBe("是");  
    expect(t("{name|book}是毛泽东思想的重要载体","毛泽东选集")).toBe("《毛泽东选集》是毛泽东思想的重要载体");  
    await scope.change("en")
    expect(t("{a}",{a:false})).toBe("False");  
    expect(t("{name|book}是毛泽东思想的重要载体","毛泽东选集")).toBe("<毛泽东选集>是毛泽东思想的重要载体");  
})


test("位置插值翻译文本内容",async ()=>{    
    const now = new Date()
    expect(t("你好")).toBe("你好");       
    expect(t("现在是{ value | }",now)).toBe(`现在是${dayjs(now).format('YYYY/M/D HH:mm:ss')}`);       

    // 经babel自动码换后，文本内容会根据idMap自动转为id
    expect(t("1")).toBe("你好");       
    expect(t("2",now)).toBe(`现在是${dayjs(now).format('YYYY/M/D HH:mm:ss')}`);     

    await scope.change("en") 

    expect(t("你好")).toBe("hello"); 
    expect(t("现在是{ value | }",now)).toBe(`Now is ${dayjs(now).format('YYYY/M/D HH:mm:ss')}`);  
    expect(t("1")).toBe("hello"); 
    expect(t("2",now)).toBe(`Now is ${dayjs(now).format('YYYY/M/D HH:mm:ss')}`);  
})

test("命名插值翻译文本内容",async ()=>{    
    const now = new Date()
    expect(t("你好")).toBe("你好");       
    expect(t("现在是{ value | }",now)).toBe(`现在是${dayjs(now).format('YYYY/M/D HH:mm:ss')}`);       

    await scope.change("en")
    expect(t("你好")).toBe("hello"); 
    expect(t("现在是{ value | }",now)).toBe(`Now is ${dayjs(now).format('YYYY/M/D HH:mm:ss')}`);  
    // 使用idMap
    expect(t("1")).toBe("hello"); 
    expect(t("2",now)).toBe(`Now is ${dayjs(now).format('YYYY/M/D HH:mm:ss')}`);  
})


test("当没有对应的语言翻译时,保持原始输出",async ()=>{    
    expect(t("我是中国人")).toBe("我是中国人");       
    await scope.change("en") 
    expect(t("我是中国人")).toBe("我是中国人");  
})
 

test("切换到未知语言时回退到默认语言",async ()=>{    
    expect(t("我是中国人")).toBe("我是中国人");       
    expect(async ()=>await scope.change("xn")).rejects.toThrow(Error);
    expect(t("我是中国人")).toBe("我是中国人");  
})
 

test("翻译复数支持",async ()=>{   
    await scope.change("en") 
    expect(t("我有{}个朋友",0)).toBe("I have no friends");       
    expect(t("我有{}个朋友",1)).toBe("I have one friends");    
    expect(t("我有{}个朋友",2)).toBe("I have two friends");    
    expect(t("我有{}个朋友",3)).toBe("I have 3 friends");    
    expect(t("我有{}个朋友",4)).toBe("I have 4 friends");       
})
test("日期时间格式化器",async ()=>{      
    let zhTranslatedResults =  zhDatetimes.map(v=>t(v,NOW))    
    let p = diffArray(zhTranslatedResults,expectZhDatetimes)
    expect(zhTranslatedResults).toStrictEqual(expectZhDatetimes)
    await scope.change("en")
    let enTranslatedResults =  zhDatetimes.map(v=>t(v,NOW))
    expect(enTranslatedResults).toStrictEqual(expectEnDatetimes)
 })


 test("货币格式化器",async ()=>{     
    let zhMoneysResults =  zhMoneys.map(v=>t(v,MONEY))
    expect(zhMoneysResults).toStrictEqual(expectZhMoneys)
    await scope.change("en")
    let enMoneysResults =  enMoneys.map(v=>t(v,MONEY))
    expect(enMoneysResults).toStrictEqual(expectEnMoneys)
 })
 
 test("数字格式化器",async ()=>{     

    expect(t("{value}",123)).toBe("123")
    expect(t("{value | number}",123)).toBe("123")
    expect(t("{value | number}",123456789)).toBe("1,2345,6789")
    expect(t("{value | number}",123456789.8888)).toBe("1,2345,6789.8888")
    expect(t("{value | number(3)}",123456789.8888)).toBe("1,2345,6789.889")
    expect(t("{value | number(3,2)}",123456789.8888)).toBe("12,34,567,89.889")
    
    await scope.change("en")
    
    expect(t("{value}",123)).toBe("123")
    expect(t("{value | number}",123)).toBe("123")
    expect(t("{value | number}",123456789)).toBe("123,456,789")
    expect(t("{value | number}",123456789.8888)).toBe("123,456,789.8888")
    expect(t("{value | number(3)}",123456789.8888)).toBe("1,2345,6789.889")
    expect(t("{value | number(3,2)}",123456789.8888)).toBe("12,34,567,89.889")

 })


})
