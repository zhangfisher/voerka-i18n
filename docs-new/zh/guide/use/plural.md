# 复数

当翻译文本内容是一个`数组`时启用复数处理机制。即在`langauges/tranclates/*.json`中的文本翻译项是一个数组。

## 启用复数处理机制
假设在`index.html`文件中具有一个翻译内容
```javascript
    t("我有{}一辆车")
```
经过`extract`命令提取为翻译文件后，如下：
```json
// languages/translates/default.json
{
    "我有{}辆车":{
        "en":"",
        "de":"...." 
    }
}
```
现在我们要求引入复数处理机制，为不同数量采用不同的翻译，只需要将上述翻译文本更改为数组形式。
```json
{
    "我有{}辆车":{
        "en":["I don't have car","I have a car","I have two cars","I have {} cars"],
        "en":["I don't have car","I have a car","I have {} cars"],
        "en":["I don't have car","I have {} cars"],
        "de":"...." 
    }
}
```
上例中，只需要在翻译文件中将上述的`en:""`更改为`[<0对应的复数文本>,<1对应的复数文本>,...,<n对应的复数文本>]`形式代表启动复数机制.
- 可以灵活地为每一个数字(`0、1、2、...、n`)对应的复数形式进行翻译
- 数量数字大于数组长度，则总是取最后一个复数形式
- 复数形式的文本同样支持位置插值和变量插值。


## 对应的翻译函数


启用复数处理机制后，在`t`函数根据变量值来决定采用单数还是复数，按如下规则进行处理。


- **不存在插值变量且t函数的第2个参数是数字**

```javascript

t("我有一辆车",0)  // ==   "I don't have a car"
t("我有一辆车",1)  // ==   "I have a car"
t("我有一辆车",2)  // ==   "I have two cars"
t("我有一辆车",100)  // == "I have 100 cars"
```

- **存在插值变量且t函数的第2个参数是数字**

就中文而言，上述没有指定插值变量是比较别扭的，一般可以引入一个位置插值变量更加友好。
```javascript

t("我有{}辆车",0)  		// ==   "I don't have a car"
t("我有{}辆车",1)  		// ==   "I have a car"
t("我有{}辆车",2)  		// ==   "I have two cars"
t("我有{}辆车",100)  	// == "I have 100 cars"
```

- **复数命名插值变量**

当启用复数功能时，`t`函数需要知道根据哪个变量来决定采用何种复数形式。

**当采用位置变量插值时，`t`函数取第一个数字类型参数作为位置插值复数。**


```javascript
t("{}有{}辆车","张三",0)
```

**当采用命名变量插值时，`t`函数约定当插值字典中存在以`$字符开头`的变量时，并且值是`数字`时，根据该变量来引用复数。**

下例中，`t`函数根据`$count`值来处理复数。

```javascript
t("{name}有{$count}辆车",{name:"张三",$count:1})
```

## **示例**

```javascript
// languages/translates/default.json
{
    "第{}章":{
        en:[
            "Chapter Zero","Chapter One", "Chapter Two", "Chapter Three","Chapter Four",
            "Chapter Five","Chapter Six","Chapter Seven","Chapter Eight","Chapter Nine",
            "Chapter {}"
        ],
        zh:["起始","第一章", "第二章", "第三章","第四章","第五章","第六章","第七章","第八章","第九章",“第{}章”]
    }
}
// 翻译函数
t("第{}章",0)  // == Chapter Zero
t("第{}章",1)  // == Chapter One
t("第{}章",2)  // == Chapter Two
t("第{}章",3)  // == Chapter Three
t("第{}章",4)  // == Chapter Four
t("第{}章",5)  // == Chapter Five
t("第{}章",6)  // == Chapter Six
t("第{}章",7)  // == Chapter Seven
...
// 超过取最后一项
t("第{}章",100)  // == Chapter 100
```
