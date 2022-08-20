/**
 
    格式化器用来对翻译文本内容中的插值变量进行处理

    比如将一个数字格式化为货币格式，或者将一个日期格式化为友好的日期格式。
    
    - 以下定义了一些格式化器，在中文场景下，会启用这些格式化器。
    import dayjs from "dayjs";
module.exports = {   
        $config:{...},
        $types:{         
            Date:(value)=>dayjs(value).format("YYYY年MM月DD日 HH:mm:ss"),    
        },
        date:(value)=>dayjs(value).format("YYYY年MM月DD日") 
        bjTime:(value)=>"北京时间"+ value,
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
 */

module.exports =  {
    // 格式化器参数
    $config:{

    },
    // 指定数据类型的默认格式化器
    $types:{    
        // "*"   : { },
        // Date  : { },
        // Number: { },
        // String: { },
        // Array : { },
        // Object: { }
    }
    // 允许重载内置的格式化器
    // --- 日期 ------
    // date          : value => { ... },
    // shortdate     : value => { ... },
    // time          : value => { ... },
    // shorttime     : value => { ... },
    // year          : value => { ... },
    // month         : value => { ... },
    // day           : value => { ... },
    // weekdayValue  : value => { ... },
    // weekday       : value => { ... },
    // shortWeekday  : value => { ... },
    // monthName     : value => { ... },
    // shorMonthName : value => { ... },
    // --- 时间 ------
    // hour          : value => { ... },
    // hour12        : value => { ... },
    // minute        : value => { ... },
    // second        : value => { ... },
    // millisecond   : value => { ... },
    // timestamp     : value => { ... }, 
    // currency      : value => { ... }, 
    // number        : value => { ... }, 
}
