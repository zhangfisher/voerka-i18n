# Plural <!-- {docsify-ignore-all} -->

The plural processing mechanism is enabled when the translated text content is one `Array`. That is, the text translation item in `langauges/tranclates/*.json` is an array.

## Enable complex processing mechanism
Suppose you have a translation in the `index.html` file.
```javascript
    t("I have {} car")
```
After the `extract` command is extracted as a translation file, it is as follows:
```json
// languages/translates/default.json
{
    "I have {} car":{
        "en":"",
        "de":"...." 
    }
}
```
Now we ask for the introduction of a complex-handling mechanism that uses different translations for different quantities, simply by changing the above translation text to an array form.
```json
{
    "I have {} car":{
        "en":["I don't have car","I have a car","I have two cars","I have {} cars"],
        "en":["I don't have car","I have a car","I have {} cars"],
        "en":["I don't have car","I have {} cars"],
        "de":"...." 
    }
}
```
In the above example, you only need to change the above `en:""` to `[<0-plural text>,<1-plural text>,...,<n-plural text>]` the form in the translation file to represent the activation of the plural mechanism.
- Flexible translation for the plural form of each number ( `0、1、2、...、n`)
- If the quantity number is greater than the array length, the last plural form is always taken
- Plural text also supports positional interpolation and variable interpolation.


## Corresponding translation function


When the plural processing mechanism is enabled, the `t` function determines whether to use the singular or plural number according to the value of the variable, and processes according to the following rules.


- **There is no interpolation variable and the second argument of the t function is a number**

```javascript

t("I have car",0)  // ==   "I don't have a car"
t("I have car",1)  // ==   "I have a car"
t("I have car",2)  // ==   "I have two cars"
t("I have car",100)  // == "I have 100 cars"
```

- **Interpolation variables exist and the second argument of the t function is a number**

As far as Chinese is concerned, it is awkward not to specify the interpolation variable above. Generally, it is more friendly to introduce a position interpolation variable.
```javascript

t("I have {} car",0)  		// ==   "I don't have a car"
t("I have {} car",1)  		// ==   "I have a car"
t("I have {} car",2)  		// ==   "I have two cars"
t("I have {} car",100)  	// == "I have 100 cars"
```

- **Complex named interpolation variable**

When the plural function is enabled, `t` the function needs to know which variable determines which plural form to use.

**When position variable interpolation is used, `t` the function takes the first numeric type parameter as the position interpolation complex. **


```javascript
t("{} have {} car","张三",0)
```

**When named variable interpolation is employed, `t` the function convention refers to a complex number according to a variable startsWith `$` when the variable exists in the interpolation dictionary and the value is `number`.**

In the following example, `t` the function processes complex numbers based on `$count` their values.

```javascript
t("I have {$count} cars",{$count:1})
```

## **Examples**

```javascript
// languages/translates/default.json
{
    "Chapter {}":{
        en:[
            "Chapter Zero","Chapter One", "Chapter Two", "Chapter Three","Chapter Four",
            "Chapter Five","Chapter Six","Chapter Seven","Chapter Eight","Chapter Nine",
            "Chapter {}"
        ],
        zh:["起始","第一章", "第二章", "第三章","第四章","第五章","第六章","第七章","第八章","第九章",“第{}章”]
    }
}

t("Chapter {}",0)  // == Chapter Zero
t("Chapter {}",1)  // == Chapter One
t("Chapter {}",2)  // == Chapter Two
t("Chapter {}",3)  // == Chapter Three
t("Chapter {}",4)  // == Chapter Four
t("Chapter {}",5)  // == Chapter Five
t("Chapter {}",6)  // == Chapter Six
t("Chapter {}",7)  // == Chapter Seven
...
t("Chapter {}",100)  // == Chapter 100
```
