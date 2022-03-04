const dayjs = require('dayjs');
const { getInterpolatedVars,  replaceInterpolatedVars , translate}  = require('../packages/runtime/index.js')
 
const messages = {
    cn:{
        1:"你好",
        2:"现在是{}",
        3:"我出生于{year}年，今年{age}岁",
        4:"我有{}个朋友",
    },
    en :{
        1:"hello",
        2:"Now is {}",
        3:"I was born in {year}, now is {age} years old",
        4:["I have no friends","I have one friends","I have two friends","I have {} friends"],
    }
}

const idMap = {
    "你好":1,
    "现在是{}":2,
    "我出生于{year}年，今年{age}岁":3,
    "我有{}个朋友":4
}




let scope1 ={
    defaultLanguage: "cn",                      // 默认语言名称
    default:  messages.cn,                              
    messages :messages.cn,                
    idMap,                           
    formatters:{                                // 当前作用域的格式化函数列表
        "*":{
            $types:{
                Date:(v)=>dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
                Boolean:(v)=>v?"True":"False",                
            },
            sum:(v,n=1)=>v+n,
            double:(v)=>v*2,
            upper:(v)=>v.toUpperCase(),
            lower:(v)=>v.toLowerCase()
        },
        cn:{
            $types:{
                Date:(v)=>dayjs(v).format('YYYY年MM月DD日 HH点mm分ss秒'),
                Boolean:(v)=>v?"是":"否",
            },
            book:(v)=>`《${v}》`,
        },
        en:{
            $types:{

            },
            book:(v)=>`<${v}>`,
        },
    },                                         
    loaders:{},                                 // 异步加载语言文件的函数列表
    global:{// 引用全局VoerkaI18n配置
        defaultLanguage: "cn",
        activeLanguage: "cn",
        languages:[
            {name:"cn",title:"中文",default:true},
            {name:"en",title:"英文"},
            {name:"de",title:"德语"},
            {name:"jp",title:"日语"}
        ],
        formatters:{                                // 当前作用域的格式化函数列表
            "*":{
                $types:{
    
                }
            },
            cn:{
                $types:{
    
                }
            },
            en:{
                $types:{
    
                }
            },
        }
    }                                   
} 

const replaceVars  = replaceInterpolatedVars.bind(scope1)
const t =  translate.bind(scope1)


function changeLanguage(language){
    scope1.global.activeLanguage = language
    scope1.messages = messages[language]

}

beforeEach(() => {
    scope1.global.activeLanguage = "cn"     // 切换到中文
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
    expect(replaceVars("{}{}{}",1,2,3)).toBe("123");
    expect(replaceVars("{a}{b}{c}",1,2,3)).toBe("123");
    // 定义了一些无效的格式化器，直接忽略
    expect(replaceVars("{a|xxx}{b|dd}{c|}",1,2,3)).toBe("123");
    expect(replaceVars("{a|xxx}{b|dd}{c|}",1,2,3,4,5,6)).toBe("123");
    expect(replaceVars("{ a|}{b|dd}{c|}{}",1,2,3)).toBe("123{}");
    // 中文状态下true和false被转换成中文的"是"和"否"
    expect(replaceVars("{}{}{}",1,"2",true)).toBe("12是");
    expect(replaceVars("{|double}{}{}",1,"2",true)).toBe("22是");
    done()
})

test("替换翻译内容的命名插值变量",done=>{    
    expect(replaceVars("{a}{b}{c}",{a:11,b:22,c:33})).toBe("112233"); 
    expect(replaceVars("{a}{b}{c}{a}{b}{c}",{a:1,b:"2",c:3})).toBe("123123");
    done()
})

test("命名插值变量使用格式化器",done=>{    
  // 提供无效的格式化器，直接忽略
  expect(replaceVars("{a|x}{b|x|y}{c|}",{a:1,b:2,c:3})).toBe("123"); 
  expect(replaceVars("{a|x}{b|x|y}{c|double}",{a:1,b:2,c:3})).toBe("126");   
  // 默认的字符串格式化器，不需要定义使用字符串方法
  expect(replaceVars("{a|x}{b|x|y}{c|double}",{a:1,b:2,c:3})).toBe("126");   
  // padStart格式化器是字符串的方法，不需要额外定义可以直接使用
  expect(replaceVars("{a|padStart(10)}",{a:"123"})).toBe("       123"); 
  expect(replaceVars("{a|padStart(10)|trim}",{a:"123"})).toBe("123"); 
  done()
})


test("命名插值变量使用格式化器",done=>{    
    // 提供无效的格式化器，直接忽略
    expect(replaceVars("{a|x}{b|x|y}{c|}",{a:1,b:2,c:3})).toBe("123"); 
    expect(replaceVars("{a|x}{b|x|y}{c|double}",{a:1,b:2,c:3})).toBe("126");   
    // 默认的字符串格式化器，不需要定义使用字符串方法
    expect(replaceVars("{a|x}{b|x|y}{c|double}",{a:1,b:2,c:3})).toBe("126");   
    expect(replaceVars("{a|padStart(10)}",{a:"123"})).toBe("       123"); 
    expect(replaceVars("{a|padStart(10)|trim}",{a:"123"})).toBe("123"); 
    done()
  })


  
test("切换到其他语言时的自动匹配同名格式化器",done=>{    
    // 默认的字符串类型的格式化器
    expect(replaceVars("{a}",{a:true})).toBe("是");  
    expect(replaceVars("{name|book}是毛泽东思想的重要载体","毛泽东选集")).toBe("《毛泽东选集》是毛泽东思想的重要载体");  
    changeLanguage("en")
    expect(replaceVars("{a}",{a:false})).toBe("False");  
    expect(replaceVars("{name|book}是毛泽东思想的重要载体","毛泽东选集")).toBe("<毛泽东选集>是毛泽东思想的重要载体");  
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
    changeLanguage("en") 
    expect(t("我是中国人")).toBe("我是中国人");  
    done()
})
 

test("切换到未知语言",done=>{    
    expect(t("我是中国人")).toBe("我是中国人");       
    changeLanguage("en") 
    expect(t("我是中国人")).toBe("我是中国人");  
    done()
})
 

test("翻译复数支持",done=>{   
    changeLanguage("en") 
    expect(t("我有{}个朋友",0)).toBe("I have no friends");       
    expect(t("我有{}个朋友",1)).toBe("I have one friends");    
    expect(t("我有{}个朋友",2)).toBe("I have two friends");    
    expect(t("我有{}个朋友",3)).toBe("I have 3 friends");    
    expect(t("我有{}个朋友",4)).toBe("I have 4 friends");       
    done()
})
 