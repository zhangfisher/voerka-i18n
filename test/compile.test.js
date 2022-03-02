const dayjs = require('dayjs');
const { getInterpolatedVars,  replaceInterpolatedVars}  = require('../src/index.js')

const scope1 ={
    defaultLanguage: "cn",                      // 默认语言名称
    default:   {                                // 默认语言包

    },                          
    messages : {                                // 当前语言包

    },                
    idMap:{                                     // 消息id映射列表

    },                           
    formatters:{                                // 当前作用域的格式化函数列表
        "*":{
            $types:{
                Date:(v)=>dayjs(v).format('YYYY/MM/DD'),
                Boolean:(v)=>v?"True":"False",                
            },
            sum:(v,n=1)=>v+n,
            double:(v)=>v*2,
            upper:(v)=>v.toUpperCase(),
            lower:(v)=>v.toLowerCase()
        },
        cn:{
            $types:{
                Date:(v)=>dayjs(v).format('YYYY年MM月DD日'),
                Boolean:(v)=>v?"是":"否",
            }
        },
        en:{
            $types:{

            }
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


test("获取翻译内容中的插值变量",done=>{
    const results = getInterpolatedVars("中华人民共和国成立于{date | year | time }年,首都是{city}市");
    expect(results.map(r=>r[0]).join(",")).toBe("date,city");
    expect(results[0][0]).toEqual("date");
    expect(results[0][1]).toEqual(["year","time"]);
    expect(results[1][0]).toEqual("city");
    expect(results[1][1]).toEqual([]);
    done()
})

test("获取翻译内容中定义了重复的插值变量",done=>{
    const results = getInterpolatedVars("{a}{a}{a|x}{a|x}{a|x|y}{a|x|y}");
    expect(results.length).toEqual(3);
    expect(results[0][0]).toEqual("a");
    expect(results[0][1]).toEqual([]);
    expect(results[1][0]).toEqual("a");
    expect(results[1][1]).toEqual(["x"]);
    expect(results[2][0]).toEqual("a");
    expect(results[2][1]).toEqual(["x","y"]);
    done()
})

test("替换翻译内容的位置插值变量",done=>{   

    expect(replaceVars("{}{}{}",1,2,3)).toBe("123");
    expect(replaceVars("{a}{b}{c}",1,2,3)).toBe("123");
    // 定义了一些无效的格式化器，直接忽略
    expect(replaceVars("{a|xxx}{b|dd}{c|}",1,2,3)).toBe("123");
    expect(replaceVars("{a|xxx}{b|dd}{c|}",1,2,3,4,5,6)).toBe("123");
    expect(replaceVars("{ a|}{b|dd}{c|}{}",1,2,3)).toBe("123{}");
    // 数据值进行
    expect(replaceVars("{}{}{}",1,"2",true)).toBe("12true");

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
  expect(replaceVars("{a|padStart(10)}",{a:"123"})).toBe("       123"); 
  expect(replaceVars("{a|padStart(10)|trim}",{a:"123"})).toBe("123"); 
  done()
})