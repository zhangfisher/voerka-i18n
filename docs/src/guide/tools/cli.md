# 命令行工具

`@voerkai18n/cli`命令行工具用来实现工程初始化、扫描提取文本、自动翻译和编译语言等功能。
 
<Alert type="error">
<b>建议将<code>@voerkai18n/cli</code>命令行工具安装在全局</b>
</Alert>


## 安装

全局安装`@voerkai18n/cli`工具。

```javascript | pure
> npm install -g @voerkai18n/cli
> yarn global add @voerkai18n/cli
> pnpm add -g @voerkai18n/cli
```

然后就可以执行：

```javascript | pure
> voerkai18n init
> voerkai18n extract
> voerkai18n compile
```

如果没有全局安装，则需要：

```javascript | pure
> yarn voerkai18n init
> yarn voerkai18n extract
> yarn voerkai18n compile
---
> pnpm voerkai18n init
> pnpm voerkai18n extract
> pnpm voerkai18n compile
```

## 初始化 - init

用于在指定项目创建`voerkai18n`国际化配置文件。

```shell
> voerkai18n init --help
初始化项目国际化配置
Arguments:
  location                           工程项目所在目录
Options:
  -D, --debug                        输出调试信息
  -r, --reset                        重新生成当前项目的语言配置
  -lngs, --languages <languages...>  支持的语言列表 (default: ["zh","en"])
  -d, --defaultLanguage              默认语言
  -a, --activeLanguage               激活语言
  -h, --help                         display help for command
```

**使用方法如下：**

首先需要在工程文件下运行`voerkai18n init`命令对当前工程进行初始化。

```javascript | pure
//- `lngs`参数用来指定拟支持的语言名称列表
> voerkai18n init . -lngs zh en jp de -d zh
```

运行`voerkai18n init`命令后，会在当前工程中创建相应配置文件。

<Tree title="myapp"> 
  <ul> 
        <li>
          languages
          <small>多语言目录</small>
          <ul>
            <li>settings.json</li>>
          </ul>
        </li>
        <li>index.md</li>
        <li>package.json</li>
        <li>...</li>  
  </ul>
</Tree>

`settings.json`文件很简单，主要是用来配置要支持的语言等基本信息。

```javascript | pure
module.exports = {
    // 拟支持的语言列表
    "languages": [
        {
            "name": "zh",
            "title": "中文"
        },
        {
            "name": "en",
            "title": "英文"
        }
    ],
    // 默认语言，即准备在源码中写的语言，一般我们可以直接使用中文
    "defaultLanguage": "zh",
    // 激活语言，即默认要启用的语言，一般等于defaultLanguage
    "activeLanguage": "zh",
    // 翻译名称空间定义，详见后续介绍。
    "namespaces": {}
}
```

**说明：**

- 您也可以手动自行创建`languages/settings.json`文件。这样就不需运行`voerkai18n init`命令了。

- 如果你的源码放在`src`文件夹，则`init`命令会自动在在`src`文件夹下创建`languages`文件夹。

- `voerkai18n init`是可选的，直接使用`extract`时也会自动创建相应的文件。

- `-m`参数用来指定生成的`settings.json`的模块类型：
  - 当`-m=auto`时，会自动读取前工程`package.json`中的`type`字段
  - 当`-m=esm`时，会生成`ESM`模块类型的`settings.json`。
  - 当`-m=cjs`时，会生成`commonjs`模块类型的`settings.json`。
  
- `location`参数是可选的，如果没有指定则采用当前目录。

  如果你想将`languages`安装在`src/languages`下，则可以指定`voerkai18n init ./src`

## 提取文本 - extract

扫描提取当前项目中的所有源码，提取出所有需要翻译的文本内容并保存在到`<工程源码目录>/languages/translates/*.json`。

```shell
> voerkai18n extract --help
扫描并提取所有待翻译的字符串到<languages/translates>文件夹中

Arguments:
  location                     工程项目所在目录 (default: "./")

Options:
  -D, --debug                  输出调试信息
  -lngs, --languages           支持的语言
  -d, --defaultLanguage  默认语言
  -a, --activeLanguage    激活语言
  -ns, --namespaces            翻译名称空间
  -e, --exclude <folders>      排除要扫描的文件夹，多个用逗号分隔
  -u, --updateMode             本次提取内容与已存在内容的数据合并策略,默认取值sync=同步,overwrite=覆盖,merge=合并
  -f, --filetypes              要扫描的文件类型
  -h, --help                   display help for command
```

**说明：**

- 启用`-d`参数时会输出提取过程，显示从哪些文件提取了几条信息。
- 如果已手动创建或通过`init`命令创建了`languages/settings.json`文件，则可以不指定`-ns`，`-lngs`，`-d`，`-a`参数。`extract`会优先使用`languages/settings.json`文件中的参数来进行提取。
- `-u`参数用来指定如何将提取的文本与现存的文件进行合并。因为在国际化流程中，我们经常面临源代码变更时需要更新翻译的问题。支持三种合并策略。
  - **sync**：同步（默认值）,两者自动合并，并且会删除在源码文件中不存在的文本。如果某个翻译已经翻译了一半也会保留。此值适用于大部情况，推荐。
  - **overwrite**：覆盖现存的翻译内容。这会导致已经进行了一半的翻译数据丢失，**慎用**。
  - **merge**：合并，与sync的差别在于不会删除源码中已不存在的文本。
- `-e`参数用来排除扫描的文件夹，多个用逗号分隔。内部采用`gulp.src`来进行文件提取，请参数。如 `-e !libs,core/**/*`。默认会自动排除`node_modules`文件夹
- `-f`参数用来指定要扫描的文件类型，默认`js,jsx,ts,tsx,vue,html`
- `extract`是基于正则表达式方式进行匹配的，而不是像`i18n-next`采用基于`AST`解析。

>**重点：**
>
>默认情况下，`voerkai18n extract`可以安全地反复多次执行，不会导致已经翻译一半的内容丢失。
>
>如果想添加新的语言支持，也`voerkai18n extract`也可以如预期的正常工作。

## 自动翻译 - translate

在工程文件夹下执行`voerkai18n translate`命令，该命令会读取`languages/settings.json`配置文件，并调用在线翻译服务（如百度在线翻译）对提取的文本(`languages/translates/*.json`)进行自动翻译。

```shell
Usage: voerkai18n translate [options] [location]

调用在线翻译服务商的API翻译译指定项目的语言包,如使用百度云翻译服务

Arguments:
  location                        工程项目所在目录

Options:
  -p, --provider <value>          在线翻译服务提供者名称或翻译脚本文件 (default: "baidu")
  -m, --max-package-size <value>  将多个文本合并提交的最大包字节数 (default: 3000)
  --appkey [key]                  API密钥
  --appid [id]                    API ID
  --no-backup                     备份原始文件
  --mode                          翻译模式，取值auto=仅翻译未翻译的,full=全部翻译
  -q, --qps <value>               翻译速度限制,即每秒可调用的API次数 (default: 1)
  -h, --help                      显示帮助
```

- 内置支持调用百度的在线翻译服务，您需要百度的网站上(http://api.fanyi.baidu.com/)申请开通服务，开通后可以得到`appid`和`appkey`（密钥）。

- `--provider`用来指定在线翻译服务提供者，内置支持的是百度在线翻译。也可以传入一个js脚本，如下：

  ```javascript | pure
  // youdao.js
  module.exports = async function(options){
      let { appkey,appid } = options
      return {
          translate:async (texts,from,to){
          	// texts是一个Array
          	// from,to代表要从哪一种语言翻译到何种语言
          	.....
          	// 在此对texts内容调用在线翻译API
  	        // 翻译结果应该返回与texts对应的数组
              // 如果出错则应该throw new Error()
          	return [...]
  	    }
      }
  }
  ```

- `qps`用来指定调用在线翻译API的速度，默认是1，代表每秒调用一次；此参数的引入是考虑到有些翻译平台的免费API有QPS限制。比如百度在线翻译免费版本限制`QPS`就是1，即每秒只能调用一次。如果您购买了服务，则可以将`QPS`调高。

- 默认情况下，每次运行时均会备份原始的翻译文件至`languages/translates/backup`，`--no-backup`可以禁止备份。

- 默认情况下，`voerkai18n translate`会在每次运行时跳过已经翻译过的内容，这样可以保留翻译成果。此特性在您对自动翻译的内容进行修改后，再多次运行`voerkai18n translate`命令时均能保留翻译内容，不会导致您修改调整过的内容丢失。`--mode full`参数可以完全覆盖翻译，请慎用。

- 为了提高在线翻译的速度，`voerkai18n translate`并不是一条文本调用一次API，而是将多条文本合并起来进行调用，但是单次调用也是有数据包大小的限制的，`--max-package-size`参数用来指定数据包的最大值。比如百度建议，为保证翻译质量，请将单次请求长度控制在 6000 bytes以内（汉字约为输入参数 2000 个）。

- 需要注意的是，自动翻译虽然准确性还不错，真实场景还是需要进行手工调整的，特别是自动翻译一般不能识别插值变量。

## 编译 - compile

编译当前工程的语言包，编译结果输出在.`/langauges`文件夹。

```shell
Usage: voerkai18n compile [options] [location]

编译指定项目的语言包

Arguments:
  location                  工程项目所在目录 (default: "./")

Options:
  -D, --debug               输出调试信息
  -m, --moduleType [types]  输出模块类型,取值auto,esm,cjs (default: "esm")
  -t, --typescript          生成`typescript`文件
  -h, --help                display help for command
```

`voerkai18n compile`执行后会在`langauges`文件夹下输出：

```javascript | pure
myapp
  |--- langauges
    |-- index.js              // 当前作用域的源码
    |-- idMap.js              // 翻译文本与id的映射文件
    |-- formatters.js         // 自定义格式化器
    |-- zh.js                 // 中文语言包
    |-- en.js       	      // 英文语言包 
    |-- xx.js           	  // 其他语言包
    |-- ...
```

**说明：**

- 在当前工程目录下，一般不需要指定参数就可以反复多次进行编译。
- 您每次修改了源码并`extract`后，均应该再次运行`compile`命令。
- 如果您修改了`formatters.js`，执行`compile`命令不会重新生成和修改该文件。