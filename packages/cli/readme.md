[![fisher/voerka-i18n](https://gitee.com/zhangfisher/voerka-i18n/widgets/widget_card.svg?colors=4183c4,ffffff,ffffff,e3e9ed,666666,9b9b9b)](https://gitee.com/zhangfisher/voerka-i18n)

# VoerkaI18n命令行工具

`@VoerkaI18n/cli`实现初始化、文本提取和编译等命令

## 初始化项目 - init 

```shell 
初始化项目国际化配置
Arguments:
  location                           工程项目所在目录
Options:
  -d, --debug                        输出调试信息
  -r, --reset                        重新生成当前项目的语言配置
  -m, --moduleType [type]            生成的js模块类型,取值auto,esm,cjs (default: "auto")
  -lngs, --languages <languages...>  支持的语言列表 (default: ["cn","en"])
  -default, --defaultLanguage        默认语言
  -active, --activeLanguage          激活语言
  -h, --help                         display help for command


```


## 提取文本 - extract

```shell 

扫描并提取所有待翻译的字符串到<languages/translates>文件夹中

Arguments:
  location                     工程项目所在目录 (default: "./")

Options:
  -d, --debug                  输出调试信息
  -lngs, --languages           支持的语言
  -default, --defaultLanguage  默认语言
  -active, --activeLanguage    激活语言
  -ns, --namespaces            翻译名称空间
  -e, --exclude <folders>      排除要扫描的文件夹，多个用逗号分隔
  -u, --updateMode             本次提取内容与已存在内容的数据合并策略,默认取值sync=同步,overwrite=覆盖,merge=合并
  -f, --filetypes              要扫描的文件类型
  -h, --help                   display help for command

```

## 编译文本 - compile

```shell 

    Usage: voerkai18n compile [options] [location]

编译指定项目的语言包

Arguments:
  location                  工程项目所在目录 (default: "./")

Options:
  -d, --debug               输出调试信息
  -m, --moduleType [types]  输出模块类型,取值auto,esm,cjs (default: "auto")
  -h, --help                display help for command

```

