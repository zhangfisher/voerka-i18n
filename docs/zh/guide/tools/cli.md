# 命令行工具

`@voerkai18n/cli`命令行工具用来实现工程初始化、扫描提取文本、自动翻译和编译语言等功能。
 
:::warning 提示
建议将`@voerkai18n/cli`命令行工具安装在全局
:::



## 安装

全局安装`@voerkai18n/cli`工具。

:::code-group

```bash
> npm install -g @voerkai18n/cli
```
```bash
> yarn global add @voerkai18n/cli
```

```bash
> pnpm add -g @voerkai18n/cli
```
:::


```shell
__     __        _         ___ _  ___
\ \   / /__ _ __| | ____ _|_ _/ |( _ ) _ __
 \ \ / / _ \ '__| |/ / _\` || || |/ _ \| '_ \
  \ V /  __/ |  |   < (_| || || | (_) | | | |
   \_/ \___|_|  |_|\_\__,_|___|_|\___/|_| |_|

Voerkai18n       Version: 3.0.6

Usage: voerkai18n [options] [command]

Options:
  -h, --help             display help for command

Commands:
  init|config [options]  初始化VoerkaI18n配置
  extract [options]      提取要翻译的文本
  compile [options]      编译语言包
  translate [options]    执行自动翻译
  wrap [options]         扫描源代码并为需要翻译的内容自动包裹t翻译函数
  inspect [options]      检查VoerkaI18n配置
  apply [options]        配置vue/react/nextjs/svelte等支持
```

## 命令

### 初始化 - init

在指定项目执行`voerkai18n`初始化，创建相应的语言工作目录和配置文件。

```shell
Usage: voerkai18n init|config [options]

初始化VoerkaI18n配置

Options:
  -d, --language-dir [path]  语言目录 (default: "src\\languages")
  --library                  是否开发库工程
  -l, --languages <tags...>  选择支持的语言
  --defaultLanguage <tag>    默认语言
  --activeLanguage <tag>     激活语言
  -t, --typescript           启用Typescript (default: true)
  -h, --help                 display help for command
```

在项目根目录下执行`voerkai18n init`命令后，会在当前工程中创建相应配置文件。

初始化后的目录结构如下：

<lite-tree>
myapp                             //i
    src
        languages                 //*
            api.json              // 翻译相关API声明
            component.ts          // 翻译组件
            index.ts              //! 入口文件        
            messages/             // 编译后的语言包
            paragraphs/           // 编译后的段落
            prompts/              // AI翻译所用的提示词
            settings.json         //! 配置文件
            storage.ts            // 存储
            loader.ts             // 语言加载器
            transform.ts          // 翻译转换器
            formatters.json       // 格式化器配置
            translates/           // 提取需要翻译的内容到此
    package.json                  //i
    index.ts                      //i
</lite-tree>

- 初始化时会根据用户提示创建`settings.json`配置,主要是用来配置要支持的语言等基本信息。
- `init`命令还有一个`config`别名，两者是等价的。可以在执行`init`后，再次执行`voerkai18n config`命令来更新配置。


### 提取文本 - extract

扫描提取当前项目中的所有源码，提取出所有需要翻译的内容并保存到：

- **文本**： `./languages/translates/messages/*.json`。
- **段落**： `./languages/translates/paragraphs/*.html`。


```shell
Usage: voerkai18n extract [options]

提取要翻译的文本

Options:
  -m, --mode [value]            更新模式,取值sync,overwrite,merge,默认sync
  -p, --patterns [patterns...]  文件匹配规则
  -h, --help                    display help for command
```

**说明：**

- `-m， --mode`参数用来指定提取文本的更新模式，有三种取值：
  
| 模式 | 说明 |
| --- | --- |
| sync | 同步（默认值），两者自动合并，并且会删除在源码文件中不存在的文本。如果某个翻译已经翻译了一半也会保留。此值适用于大部情况，推荐。 |
| overwrite | 覆盖现存的翻译内容。这会导致已经进行了一半的翻译数据丢失，慎用。 |
| merge | 合并，与sync的差别在于不会删除源码中已不存在的文本。 |

- `-p, --patterns`参数用来指定要扫描的文件匹配规则，比如`src/**/*.{js,ts,tsx,jsx}`。

`-p, --patterns`参数采用的`glob`规则，参考[这里](https://www.npmjs.com/package/glob)，其默认值是：

```ts {13}
[
        "!coverage",
        "!.pnpm",
        "!**/*.test.*",
        "!**/*.spec.*",
        "!.vscode",
        "!dist",
        "!.git",
        "!.turbo",
        "!**/*.d.ts",
        "!*.config.{js,ts}",
        "!node_modules",
        "!"+<langRelDir>,    
]
```

**通过`--patterns`可以增加提取规则，以下是简单示例：**

| 模式 | 说明 |
| --- | --- |
| `--patterns "!src/libs/**"` | 排除`src/libs`文件夹下的所有文件 |

:::warning 重要提醒
默认情况下，`voerkai18n extract`可以安全地反复多次执行，不会导致已经翻译一半的内容丢失。
如果想添加新的语言支持，也`voerkai18n extract`也可以如预期的正常工作。
:::

### 自动翻译 - translate

`voerkai18n translate`命令调用在线翻译服务(如`AI`,`百度翻译`)对提取的文本和段落进行自动翻译。

```shell
Usage: voerkai18n translate [options]

执行自动翻译

Options:
  -m, --mode <value>          翻译模式,取值auto=仅翻译未翻译的,full=全部翻译 (default: "auto")
  -l, --language <name>       只翻译指定的语言
  -f, --file <name>           只翻译指定的文件,如messages/default.json
  -p, --provider <value>      在线翻译服务提供者名称或翻译脚本文,取值:ai | baidu (default: "ai")
  --max-package-size <value>  将多个文本合并提交的最大包字节数 (default: 150)
  --api-url <url>             API URL
  --api-id <id>               API ID
  --api-model <name>          AI模型名称
  --api-key <key>             API密钥
  --api <name>                API服务名称,声明在languages/api.json中 (default: "baidu")
  -q, --qps <value>           翻译速度限制,即每秒可调用的API次数 (default: 0)
  -h, --help                  display help for command
```

#### API配置

执行在线翻译前需要配置`languages/api.json`文件，该文件用来配置在线翻译服务的相关信息。

```json
{
    "baidu": {
        "id": "<从百度翻译申请的appid>",
        "key": "<从百度翻译申请的appkey>",
    },
    "qwen":{
        "key":"<AI大模型 API Key>",
        "url":"<AI大模型 API URL>",
        "model":"<模型名称>"
    },
}
```

:::warning 重要提示
请将`languages/api.json`文件加入到`.gitignore`文件中，避免将敏感信息提交到代码仓库。
:::

#### AI翻译

在线翻译在`3.0`版本中默认采用`AI翻译`,要求大模型支持`OpenAI API`兼容的`API`。

首先在`languages/api.json`中配置`API`信息，以配置`阿里通义千问大模型`为例,如下：

```json  {2}
{
    "qwen":{               // 服务名称，任意名称
        "key":"<AI大模型 API Key>",
        "url":"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        "model":"qwen-max-latest"
    }
}
```

然后执行`voerkai18n translate`命令，指定`--api qwen`参数即可。

```shell
> voerkai18n translate --api qwen
```

**说明:**

- 大模型翻译服务提供的API需要是`OpenAI API`兼容的，您在大模型服务提供商申请`API Key`后，然后配置到`languages/api.json`中。


- 由于不同的大模型翻译服务可能存在差异，特殊是大模型幻觉的存在，同样的提示词也可能返回不同的翻译结果，因此在使用大模型翻译时，往往**需要对提示词进行微调**。

- 在执行`voerkai18n init`后，会在`languages`目录下生成`prompts`目录，您可以在该目录下修改提示词，以便AI翻译服务更好地理解您的翻译需求。

- 参考[自动翻译](../advanced/auto-translate.md)章节了解更多关于大模型翻译的内容。

:::warning 提示
推荐采用阿里通用千问大模型，该模型在翻译质量和速度上都有很好的表现。申请地址：[阿里通用千问](https://www.aliyun.com/product/tongyi?spm=5176.29956983.J_4VYgf18xNlTAyFFbOuOQe.d_menu_0.58424931lkYrnm)
:::

#### 百度翻译

- 内置支持调用百度的在线翻译服务，您需要百度的网站上(http://api.fanyi.baidu.com/)申请开通服务，开通后可以得到`appid`和`appkey`（密钥）。


- `qps`用来指定调用在线翻译API的速度，默认是1，代表每秒调用一次；此参数的引入是考虑到有些翻译平台的免费API有QPS限制。比如百度在线翻译免费版本限制`QPS`就是1，即每秒只能调用一次。如果您购买了服务，则可以将`QPS`调高。

- 默认情况下，每次运行时均会备份原始的翻译文件至`languages/translates/backup`，`--no-backup`可以禁止备份。

- 为了提高在线翻译的速度，`voerkai18n translate`并不是一条文本调用一次API，而是将多条文本合并起来进行调用，但是单次调用也是有数据包大小的限制的，`--max-package-size`参数用来指定数据包的最大值。比如百度翻译建议，为保证翻译质量，请将单次请求长度控制在 6000 bytes以内（汉字约为输入参数 2000 个）。

#### 翻译说明


- 默认情况下，`voerkai18n translate`会在每次运行时跳过已经翻译过的内容，这样可以保留翻译成果。此特性在您对自动翻译的内容进行修改后，再多次运行`voerkai18n translate`命令时均能保留翻译内容，不会导致您修改调整过的内容丢失。`--mode full`参数可以完全覆盖翻译，请慎用。

- 需要注意的是，自动翻译虽然准确性还不错，真实场景还是需要进行手工调整的，特别是自动翻译一般不能识别插值变量。

- 自动翻译不支持对复数形式的内容进行翻译，需要手工进行翻译


### 编译 - compile

编译当前工程的语言包，编译结果输出在.`/langauges`文件夹。

```shell
编译语言包

Options:
  -t, --typescript               启用typescript
  -m, --module-type [values...]  模块类型,取值:cjs,esm
  -h, --help                     display help for command
```

`voerkai18n compile`执行后会在`langauges`文件夹下输出：

<Tree>
languages
    messages      //! 编译tanslates/messages/*.json到此
        en-US.ts
        zh-CN.ts
        idMap.json
        ...
    paragraphs    //! 编译tanslates/paragraphs/*.html到此
        zh-CN/
          paragraph1.html
          paragraph2.html
          ...
        en-US/
          paragraph1.html
          paragraph2.html
          ...  
    ...
</Tree>

### 自动包裹 - wrap

`voerkai18n wrap`命令扫描源代码并为需要翻译的内容自动包裹`t`翻译函数。

```shell
Usage: voerkai18n wrap [options]

扫描源代码并为需要翻译的内容自动包裹t翻译函数。

Options:
  -p, --patterns <patterns...>  扫描匹配规则 (default: ["./src/**/*.{js,ts,tsx,jsx}"])
  --apply                       应用包装修改到源文件 (default: false)
  --prompt [value]              languages/prompts文件夹里的提示模板文件名称 (default: "wrap")
  --api-url [value]             AI大模型API地址
  --api-key [value]             AI大模型API密钥
  --api-model [value]           AI大模型
  --api [value]                 languages/api.json中预设AI服务
  -h, --help                    display help for command
```

- `voerkai18n wrap`命令也是调用`AI`服务，因此需要配置`languages/api.json`文件,同`voerkai18n translate`命令。
- `--prompt`参数用来指定提示词模板文件，模板文件位于`languages/prompts/<名称>`目录下，您可以根据需要自定义提示词模板。默认值是`wrap`。

### 应用集成 - apply

`voerkai18n apply`命令用来配置`vue/react/nextjs/svelte`等框架的自动集成。

```shell
voerkai18n apply
```

或者指定框架名称:

```shell
> voerkai18n apply -f vue
> voerkai18n apply -f react
> voerkai18n apply -f nextjs
> voerkai18n apply -f vue2
> ...
```

### 检查配置 - inspect

检查VoerkaI18n配置

```shell
Usage: voerkai18n inspect [options]
```

## 说明

### 多语言

`@voerkai18n/cli`本身也支持多语言。

- 默认情况下,`@voerkai18n/cli`会尝试读取当前操作系的语言，并使用该语言进行显示。如果当前操作系统的语言不在支持的语言列表中，则会使用`en`作为默认语言。

- 可以通过环境变量`set LANGUAGE=xx`来指定默认的语言，比如`set LANGUAGE=zh & voerkai18n extract`。
 