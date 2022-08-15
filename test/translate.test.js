const {i18nScope, translate, getInterpolatedVars }  = require('../packages/runtime/index')
const dayjs = require('dayjs');

const loaders = {
    zh:{
        1:"你好",
        2:"现在是{}",
        3:"我出生于{year}年，今年{age}岁",
        4:"我有{}个朋友",
    },
    en :{
        1:"hello",
        2:"Now is {}",
        3:"I was born in {year}, now is {age} years old",
        4:["I have no friends","I have one friends","I have two friends","I have {} friends"]
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
    1:"你好",
    2:"现在是{}",
    3:"我出生于{year}年，今年{age}岁",
    4:"我有{}个朋友"
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
    expect(trim("{|double}{}{}",1,"2",true)).toBe("22是");
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
  // 默认的字符串格式化器，不需要定义使用字符串方法
  expect(t("{a|x}{b|x|y}{c|double}",{a:1,b:2,c:3})).toBe("126");   
  // padStart格式化器是字符串的方法，不需要额外定义可以直接使用
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


  
test("切换到其他语言时的自动匹配同名格式化器",done=>{    
    // 默认的字符串类型的格式化器
    expect(t("{a}",{a:true})).toBe("是");  
    expect(t("{name|book}是毛泽东思想的重要载体","毛泽东选集")).toBe("《毛泽东选集》是毛泽东思想的重要载体");  
    changeLanguage("en")
    expect(t("{a}",{a:false})).toBe("False");  
    expect(t("{name|book}是毛泽东思想的重要载体","毛泽东选集")).toBe("<毛泽东选集>是毛泽东思想的重要载体");  
    done()
})


test("位置插值翻译文本内容",done=>{    
    const now = new Date()
    expect(t("你好")).toBe("你好");       
    expect(t("现在是{}",now)).toBe(`现在是${dayjs(now).format('YYYY年MM月DD日 HH点mm分ss秒')}`);       

    // 经babel自动码换后，文本内容会根据idMap自动转为id
    expect(t("1")).toBe("你好");       
    expect(t("2",now)).toBe(`现在是${dayjs(now).format('YYYY年MM月DD日 HH点mm分ss秒')}`);     

    changeLanguage("en")
    expect(t("你好")).toBe("hello"); 
    expect(t("现在是{}",now)).toBe(`Now is ${dayjs(now).format('YYYY-MM-DD HH:mm:ss')}`);  
    expect(t("1")).toBe("hello"); 
    expect(t("2",now)).toBe(`Now is ${dayjs(now).format('YYYY-MM-DD HH:mm:ss')}`);  
    done()
})

test("命名插值翻译文本内容",done=>{    
    const now = new Date()
    expect(t("你好")).toBe("你好");       
    expect(t("现在是{}",now)).toBe(`现在是${dayjs(now).format('YYYY年MM月DD日 HH点mm分ss秒')}`);       
   

    changeLanguage("en")
    expect(t("你好")).toBe("hello"); 
    expect(t("现在是{}",now)).toBe(`Now is ${dayjs(now).format('YYYY-MM-DD HH:mm:ss')}`);  
    expect(t("1")).toBe("hello"); 
    expect(t("2",now)).toBe(`Now is ${dayjs(now).format('YYYY-MM-DD HH:mm:ss')}`);  
    done()
})


test("当没有对应的语言翻译时",done=>{    
    expect(t("我是中国人")).toBe("我是中国人");       
    scope.change("en") 
    expect(t("我是中国人")).toBe("我是中国人");  
    done()
})
 

test("切换到未知语言时回退到默认语言",done=>{    
    expect(t("我是中国人")).toBe("我是中国人");       
    scope.change("xn") 
    expect(t("我是中国人")).toBe("我是中国人");  
    done()
})
 

test("翻译复数支持",done=>{   
    scope.change("en") 
    expect(t("我有{}个朋友",0)).toBe("I have no friends");       
    expect(t("我有{}个朋友",1)).toBe("I have one friends");    
    expect(t("我有{}个朋友",2)).toBe("I have two friends");    
    expect(t("我有{}个朋友",3)).toBe("I have 3 friends");    
    expect(t("我有{}个朋友",4)).toBe("I have 4 friends");       
    done()
})
 