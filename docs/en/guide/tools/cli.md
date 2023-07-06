# Command-line tools <!-- {docsify-ignore-all} -->

 `@voerkai18n/cli` Command-line tools are used to initialize projects, scan and extract text, automatically translate and compile languages.
 
<Alert type="error">
<b>It is recommended <code> to install the @ voerkai18n/CLI </code> command line tool globally</b>
</Alert>


## Installation

Global installation `@voerkai18n/cli` tool.

```javascript
> npm install -g @voerkai18n/cli
> yarn global add @voerkai18n/cli
> pnpm add -g @voerkai18n/cli
```

You can then execute:

```javascript
> voerkai18n init
> voerkai18n extract
> voerkai18n compile
```

If you do not have a global installation, you need:

```javascript
> yarn voerkai18n init
> yarn voerkai18n extract
> yarn voerkai18n compile
---
> pnpm voerkai18n init
> pnpm voerkai18n extract
> pnpm voerkai18n compile
```

## Initialize -init

Use to create `voerkai18n` an internationalization profile at the specified project.

```shell
> voerkai18n init --help
初始化项目国际化配置
Arguments:
  location                           工程项目所在目录
Options:
  -D, --debug                        输出调试信息
  -r, --reset                        重新生成当前项目的语言配置
  -m, --moduleType [types]           输出模块类型,取值auto(默认),esm,cjs
  -lngs, --languages <languages...>  支持的语言列表 (default: ["zh","en"])
  -t, --typescript                   输出typescript代码
  -d, --defaultLanguage              默认语言
  -a, --activeLanguage               激活语言
  -h, --help                         display help for command
```

** The use method is as follows: **

First, run `voerkai18n init` the command under the project file to initialize the current project.

```javascript
//- `lngs`参数用来指定拟支持的语言名称列表
> voerkai18n init . -lngs zh en jp de -d zh
```

After running `voerkai18n init` the command, the corresponding configuration file is created in the current project.

<Tree title="myapp"> 
  <ul> 
        <li>
          languages
          <small>多语言目录</small>
          <ul>
            <li>settings.json</li>
            <li>index.(js|ts)</li>
            <li>idMap.(js|ts)</li>
          </ul>
        </li>
        <li>index.md</li>
        <li>package.json</li>
        <li>...</li>  
  </ul>
</Tree>

 `settings.json` The file is simple and is mainly used to configure basic information such as the languages to be supported.

```javascript
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

** Explain **

- If your source code is in a `src` folder, the `init` command will automatically create `languages` a folder under the `src` folder.

-  `-m` Parameter is used to specify the module type of the `settings.json` generated:
  - At `-m=auto` that time, the module type of the source code will be automatically determined according to the fields and other information in `type` the previous project `package.json`.
  - At `-m=esm` that time, the `settings.json` module type is generated `ESM`.
  - At `-m=cjs` that time, the `settings.json` module type is generated `commonjs`.
  
-  `location` Parameter is optional, and the current directory is assumed if none is specified.
-  `voerkai18n init` It can identify whether it is a `typescript` project or not by checking whether it exists `tsconfig.json`. It can also be explicitly specified `voerkai18n init --typescript` to generate the `typescript` corresponding source code.

  If you want to `languages` install `src/languages` under, you can specify `voerkai18n init./src`

- The `idMap` generated file is an empty file, which will be updated automatically without modification.
-  `index.(js|ts)` It is also a placeholder file that will be overwritten and regenerated on subsequent execution `compile`

## Extract text-extract

Scan and extract all the source code in the current project, extract all the text content to be translated and save it in to `<工程源码目录>/languages/translates/*.json`.

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

** Explain **

- When the parameter is enabled `-d`, the extraction process is output, showing how many pieces of information were extracted from which files.
- If the `languages/settings.json` file has been created manually or through `init` the command, the? `-lngs`? `-d`? `-a` parameter can be left unspecified `-ns`. The parameters in the file `extract` take precedence `languages/settings.json` for extraction.
-  `-u` The parameter specifies how to merge the extracted text with an existing file. Because in the internationalization process, we often face the problem of updating the translation when the source code changes. Three merge strategies are supported.
  - The ** sync ** two are automatically merged, and text that does not exist in the source file is deleted. If a translation is already half translated, it will be retained. This value is recommended for most situations.
  - ** overwrite **: Overwrite existing translations. This results in the loss of half of the translated data. ** Use with caution **.
  - ** merge ** Merge, unlike sync, does not delete text that no longer exists in the source code.
- The `-e` parameter is used to exclude folders from being scanned. Multiple folders are separated by commas. Used `gulp.src` internally for file extraction. Please use the parameter. Such as `-e!libs,core/**/*`. Folders are automatically excluded `node_modules` by default
-  `-f` The parameter is used to specify the file type to be scanned. Default `js,jsx,ts,tsx,vue,html`
- Matching `extract` is based on regular expressions, not `AST` parsing as `i18n-next` is the case.

> ** Key ** > > By default, `voerkai18n extract` it is safe to execute multiple times without losing half of what has already been translated. > > `voerkai18n extract` Also works as expected if you want to add new language support.

## Automatic translation-translate

Execute `voerkai18n translate` the command under the project folder. The command will read `languages/settings.json` the configuration file and call the online translation service (such as Baidu Online Translation) to automatically translate the extracted text ( `languages/translates/*.json`).

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

- Built-in support for calling Baidu's online translation service, you need to Baidu's website (http://api.fanyi.baidu.com/) to apply for opening the service, after opening, you can get `appid` and `appkey` (key).

-  `--provider` It is used to specify the online translation service provider, and the built-in support is Baidu Online Translation. You can also pass in a JS script, as follows:

  ```javascript
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

-  `qps` It is used to specify the speed of calling online translation API. The default is 1, which represents one call per second. The introduction of this parameter is to consider that some free APIs of translation platforms have QPS restrictions. For example, the free version of Baidu Online Translation is limited `QPS` to 1, that is, it can only be called once per second. If you purchased the service, you can turn up the `QPS`.

- By default, the original translation file is backed up to `languages/translates/backup` each run. `--no-backup` You can disable the backup.

- By default, `voerkai18n translate` content that has already been translated is skipped each time it is run, so that the translation is preserved. After you modify the content of automatic translation, this feature can keep the translation content when you run `voerkai18n translate` the command many times, and will not cause the content you have modified and adjusted to be lost. `--mode full` The parameter can completely override the translation, so use it with caution.

- In order to improve the speed of online translation, `voerkai18n translate` the API is not called once for one piece of text, but is called by combining multiple pieces of text. However, a single call is also limited by the size of the data packet, and `--max-package-size` the parameter is used to specify the maximum value of the data packet. For example, Baidu suggests that in order to ensure the quality of translation, please control the length of a single request within 6000 bytes (about 2000 input parameters for Chinese characters).

- It should be noted that although the accuracy of automatic translation is good, the real scene still needs to be adjusted manually, especially the automatic translation generally can not recognize the interpolation variables.

## Compile-compile

Compile the language pack of the current project, and output the result in the. `/langauges` Folder.

```shell
Usage: voerkai18n compile [options] [location]

编译指定项目的语言包

Arguments:
  location                  工程项目所在目录 (default: "./")

Options:
  -D, --debug               输出调试信息
  -m, --moduleType [types]  输出模块类型,取值auto,esm,cjs (default: "esm")
  -l, --library             开发库模式(default:false)
  -t, --typescript          生成typescript文件
  -u, --update-runtime      自动更新runtime
  --skip                    跳过更新language/index.(ts|js)文件(default:false) 
  -h, --help                display help for command
```

After `voerkai18n compile` execution, it will be `langauges` output under the folder:

```typescript
  languages
    settings.json
    index.(js|ts)
    idMap.(js|ts)
    zh.(js|ts)
    en.(js|ts)
    xx.(js|ts)
    storage.(js|ts)
    formatters
      zh.(js|ts)
      en.(js|ts)
      xx.(js|ts)
```

## Multilingual

By default, '@voerkai18n/cli' will attempt to read the language of the current operating system and display that language. If the language of the current operating system is not in the supported Index of language articles, 'en' will be used as the default language.

-You can specify the default language through the '-- lang' parameter, such as' voerkai18n -- lang zh '.
-You can specify the default language through the environment variable 'set LANGUAGE=xx', such as' set LANGUAGE=zh&voerkai18n extract '.

'@voerkai18n/cli' supports the following languages:`zh`,`en`,`de`,`jp`,`fra`,`spa`,`kor`,`ru`,`it`
## Explain

- In the current project directory, you can compile repeatedly without specifying parameters.
- Every time you modify the source code `extract`, you should run `compile` the command again.
- If you do `formatters.js`, executing `compile` the command does not regenerate and modify the file.
- By default, `compile` the command is generated `languages/**/*.ts` when the current project is found to exist `ts.config.ts`. It can also be explicitly specified `voerkai18n compile --typescript` to generate `ts` source code, or explicitly specified `voerkai18n compile --typescript=false` to disable generation `ts` of source code.
- ** Notice **? `compile` Command will re-overwrite `languages/index.(js|ts)`. If you modified the file and do not want it to be overwritten, specify `--skip` the parameter.
