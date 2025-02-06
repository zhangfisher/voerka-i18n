/**
 
    格式化器用来对翻译文本内容中的插值变量进行格式化，
    比如将一个数字格式化为货币格式，或者将一个日期格式化为友好的日期格式。
    
    - 以下定义了一些格式化器，在中文场景下，会启用这些格式化器。
    import dayjs from "dayjs";
    const formatters =  {   
        "*":{                                       // 在所有语言下生效的格式化器  
            $types:{...},                            // 只作用于特定数据类型的默认格式化器
            ....                                    // 全局格式化器
        },                                            
        zh:{
            // 只作用于特定数据类型的格式化器
            $types:{         
                Date:(value)=>dayjs(value).format("YYYY年MM月DD日 HH:mm:ss"),    
            },
            date:(value)=>dayjs(value).format("YYYY年MM月DD日") 
            bjTime:(value)=>"北京时间"+ value,
            [格式化器名称]:(value)=>{...},
            [格式化器名称]:(value)=>{...},
            [格式化器名称]:(value)=>{...},
        },
        en:{ 
            $types:{  
                Date:(value)=>dayjs(value).format("YYYY/MM/DD HH:mm:ss"),   // 默认的格式化器            
            }, 
            date:(value)=>dayjs(value).format("YYYY/MM/DD")
            bjTime:(value)=>"BeiJing "+ value,
            [格式化器名称]:(value)=>{...},
            [格式化器名称]:(value)=>{...},
            [格式化器名称]:(value)=>{...},   
        }
    }
    - 在翻译函数中使用格式化器的方法,示例如下：
       
      t("Now is { value | date | bjTime  }",{value: new Date()})
      其等效于：
      t(`Now is ${bjTime(date(value))",{value: new Date()})
      由于value分别经过两个管道符转换，上一个管道符的输出作为下一个管道符的输入,可以多次使用管道符。

      最终的输出结果：
      中文: "现在是北京时间2022年3月1日"
      英文: "Now is BeiJing 2022/03/01" 
      
 * 
 */




export default{
    // 在所有语言下生效的格式化器
    "*":{ 
        //[格式化名称]:(value)=>{...},
        //[格式化名称]:(value,arg)=>{...},
    },                                                
    // 在所有语言下只作用于特定数据类型的格式化器   
    $types:{

    },                                          
    zh:{
        $types:{
            // 所有类型的默认格式化器
            // "*":{
                
            // },
            // Date:{

            // },
            // Number:{

            // },
            // String:{

            // },
            // Array:{

            // },
            // Object:{

            // }
        }        
    },
    en:{
        $types:{
            // 所有类型的默认格式化器
            // "*":{
                
            // },
            // Date:{

            // },
            // Number:{

            // },
            // String:{

            // },
            // Array:{

            // },
            // Object:{

            // }
        }        
    }
}