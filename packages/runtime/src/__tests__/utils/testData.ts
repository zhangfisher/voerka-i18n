
import zhFormatters from '../../formatters/zh';
import enFormatters from '../../formatters/en';
import { VoerkaI18nManager } from '../../manager';
import { VoerkaI18nFormatterRegistry } from '../../formatterRegistry';
import { VoerkaI18nLanguageMessages, VoerkaI18nFormatterConfigs, VoerkaI18nTranslate } from '../../types';

export const zhMessages:VoerkaI18nLanguageMessages = {
    $config:{
        add:{a:1},
        dec:{b:1}
    },
    "你好": "你好",
    "我叫{name},今年{age}岁": "我叫{name},今年{age}岁",
    "中国": "中国",
    "我有{}部车": ["我没有车","我有一部车","我有两部车","我有{}部车"]  ,
    "我的工资是每月{}元":"我的工资是每月{}元"
}
export const enMessages={
    "你好": "hello",
    "我叫{name},今年{age}岁": "My name is {name},Now {age} years old year",
    "中国": "china",
    "我有{}部车": ["I don't have car","I have a car","I have two cars","I have {} cars"],
    "我的工资是每月{}元":"My salary is {} yuan per month"
}

export const messages = {
    zh: zhMessages,
    en: enMessages
}

export const idMapData={
    "你好":1,
    "你好,{name}":2,
    "中国":3,
    "我有{}部车":4
}
export const languages = [
    { name: "zh",default:true,active:true},
    { name: "en"}
]

Object.assign(zhFormatters.$config,{
    x:{x1:1,x2:2},
    y:{y1:1,y2:2}
})
Object.assign(enFormatters.$config,{
    x:{x1:11,x2:22},
    y:{y1:11,y2:22},
    z:{z1:11,z2:22}
})

export const formatters ={
    "*":{
        $config:{
            x:{g:1},
            y:{g:1},
            g:{g1:1,g2:2}
        }
    },
    zh:{
        $config:{},
        // $types:{
        //     Boolean:(value:any)=>value?'是':'否',
        // },
        prefix:(value:any,args:any[],config?:VoerkaI18nFormatterConfigs)=>config?.chars+value,
        first:(value:any)=>'ZH'+value[0],
    },
    en:{ 
        $config:{},
        first:(value:any)=>'EN'+value[0],
    },
    jp:()=>{}
}
