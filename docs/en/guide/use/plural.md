# Plurals

The plural processing mechanism is activated when the translation text content is an `array` in `langauges/tranclates/messages/*.json`.

## Enabling Plural Processing
Suppose there is a translation content in the `index.html` file:
```javascript
    t("我有{}一辆车")
```
After extraction using the `extract` command, the translation file looks like this:
```json
// languages/translates/messages/default.json
{
    "我有{}辆车":{
        "en":"",
        "de":"...." 
    }
}
```
Now, to implement plural processing for different quantities, we just need to change the above translation text to an array format.

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
In the above example, just change `en:""` to `[<plural text for 0>,<plural text for 1>,...,<plural text for n>]` format in the translation file to activate the plural mechanism.
- You can flexibly translate plural forms for each number (`0, 1, 2, ..., n`)
- If the quantity number is greater than the array length, it always takes the last plural form
- Plural form text also supports positional interpolation and variable interpolation.

## Corresponding Translation Functions

After enabling plural processing, the `t` function determines whether to use singular or plural based on the variable value, according to the following rules.

- **No interpolation variables and the second parameter of t function is a number**

```javascript
t("我有一辆车",0)  // ==   "I don't have a car"
t("我有一辆车",1)  // ==   "I have a car"
t("我有一辆车",2)  // ==   "I have two cars"
t("我有一辆车",100)  // == "I have 100 cars"
```

- **With interpolation variables and the second parameter of t function is a number**

For Chinese, not specifying interpolation variables as above is awkward. Generally, introducing a positional interpolation variable is more friendly.
```javascript
t("我有{}辆车",0)  		// ==   "I don't have a car"
t("我有{}辆车",1)  		// ==   "I have a car"
t("我有{}辆车",2)  		// ==   "I have two cars"
t("我有{}辆车",100)  	// == "I have 100 cars"
```

- **Named Interpolation Variables for Plurals**

When plural functionality is enabled, the `t` function needs to know which variable to use to determine which plural form to use.

**When using positional variable interpolation, the `t` function takes the first numeric type parameter as the positional interpolation plural.**

```javascript
t("{}有{}辆车","张三",0)
```

**When using named variable interpolation, the `t` function conventionally uses variables starting with `$` and having numeric values to reference plurals.**

In the example below, the `t` function handles plurals based on the `$count` value.

```javascript
t("{name}有{$count}辆车",{name:"张三",$count:1})
```

## **Examples**

```javascript
// languages/translates/default.json
{
    "第{}章":{
        en:[
            "Chapter Zero","Chapter One", "Chapter Two", "Chapter Three","Chapter Four",
            "Chapter Five","Chapter Six","Chapter Seven","Chapter Eight","Chapter Nine",
            "Chapter {}"
        ],
        zh:["起始","第一章", "第二章", "第三章","第四章","第五章","第六章","第七章","第八章","第九章","第{}章"]
    }
}
// Translation functions
t("第{}章",0)  // == Chapter Zero
t("第{}章",1)  // == Chapter One
t("第{}章",2)  // == Chapter Two
t("第{}章",3)  // == Chapter Three
t("第{}章",4)  // == Chapter Four
t("第{}章",5)  // == Chapter Five
t("第{}章",6)  // == Chapter Six
t("第{}章",7)  // == Chapter Seven
...
// For numbers beyond array length, use the last item
t("第{}章",100)  // == Chapter 100
```
