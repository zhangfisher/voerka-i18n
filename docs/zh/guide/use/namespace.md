# 名称空间

`voerkai18n `的名称空间是为了解决当源码文件非常多时，通过名称空间对翻译内容进行分类翻译的。

假设一个大型项目，其中源代码文件有上千个。默认情况下，`voerkai18n extract`会扫描所有源码文件将需要翻译的文本提取到`languages/translates/default.json`文件中。由于文件太多会导致以下问题：

- 内容太多导致`default.json`文件太大，有利于管理
- 有些翻译往往需要联系上下文才可以作出更准确的翻译，没有适当分类，不容易联系上下文。

因此，引入`名称空间`就是目的就是为了解决此问题。

配置名称空间，需要配置`languages/settings.json`文件。

```javascript
// 工程目录：d:/code/myapp
// languages/settings.json
module.exports = {
    namespaces:{
        //"名称":"相对路径"，
        “routes”:“routes”,
        "auth":"core/auth",
        "admin":"views/admin"
    }
}
```

以上例子代表：

- 将`d:\code\myapp\routes`中扫描到的文本提取到`routes.json`中。
- 将`d:\code\myapp\auth`中扫描到的文本提取到`auth.json`中。
- 将`d:\code\myapp\views/admin`中扫描到的文本提取到`admin.json`中。

最终在` languages/translates`中会包括：

```shell
languages
  |-- translates
      |-- default.json
      |-- routes.sjon
      |-- auth.json
      |-- admin.json      
```

然后，`voerkai18n compile`在编译时会自动合并这些文件，后续就不再需要名称空间的概念了。

`名称空间`仅仅是为了解决当翻译内容太多时的分类问题。

