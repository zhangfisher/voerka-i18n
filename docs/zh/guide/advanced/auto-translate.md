# 自动翻译

传统的国际化解决方案均是需要手工进行翻译的，`voerkai18n`解决方案支持调用在线翻译服务进行自动翻译。

**使用`voerkai18n translate`命令能调用在线翻译服务完成对提取的文本的自动翻译。**

在`VoerkaI18n 3.0`中支持两种翻译引擎

- 百度翻译
- AI翻译

- 目前支持访问`百度在线API`进行自动翻译。百度提供了免费的在线API，虽然只支持`QPS=1`，即每秒调用一次。但是`voerkai18n translate`命令会对要翻译的文本进行合并后再调用，因此大部分情况下，均足够使用了。

## 基本用法

在工程项目下直接调用`voerkai18n translate`就可对当前项目下的所有`JSON`文件进行自动翻译。

### 第1步: 申请在线翻译服务API

- **百度在线翻译服务**

百度在线翻译服务的地址在[这里](https://fanyi-api.baidu.com/)

- **AI翻译服务**

任意能提供`OpenAI API` 兼容接口的在线大模型服务，比如`deepseek`，或`混元大模型`。

推荐用`混元大模型qwen-max-latest`，申请地址[这里](https://www.aliyun.com/product/tongyi?spm=5176.29956983.J_4VYgf18xNlTAyFFbOuOQe.d_menu_0.58424931lkYrnm)


:::warning 提示
以上在线翻译服务一般具有一定的免费额度，小规模翻译一般够。
:::

### 第2步: 配置API

在申请到了以上翻译服务的API后，在`languages/api.json`中配置访问翻译引擎的API,如下：

```json
{
    "deepseek":{
        "key":"sk-a27804xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "url":"https://api.deepseek.com/chat/completions",
        "model":"deepseek-chat"
    },
    "qwen":{
        "key":"sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "url":"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        "model":"qwen-max-latest"
    },
    "baidu":{
        "key":"xxxxxxxxxxxxxxx",     // appkey
        "id":"xxxxxxxxxxxxxxx"       // appid
    }
}
```

### 第3步: 执行翻译

- **AI翻译**

```shell
> voerkai18n translate --api <api.json中声明的名称>
> voerkai18n translate --api qwen
```

- **百度翻译**

```shell
> voerkai18n translate --api baidu --provider baidu
```

## AI翻译

`VoerkaI18n`要求`AI翻译`所使用的大模型支持`OpenAI API`兼容接口。

一般情况下，`AI翻译`的翻译质量要比`百度翻译`要好。
但是`AI翻译`的质量取决于所使用的模型，不同的模型翻译质量可能会有所不同。同时提交翻译时所采用的提示词`prompt`也可以影响翻译效果，特别是在翻译大段文本时。

`VoerkaI18n`支持用户自行微调翻译提示词。

<lite-tree>
myapp
    src
        languages
            prompts/        //!            提示词
                tranlate-messages.md        //! 翻译提示词
                translate-paragraphs.md  //! 
            api.json
            ... 
</lite-tree>

-  `tranlate-messages.md`和`translate-paragraphs.md`分别是对翻译短句和翻译段落的提示词，用户可以根据自己的需求进行调整。

:::warning 注意
由于大模型翻译的质量取决于所使用的模型和提示词，有时大模型幻觉可能会出现不准确的翻译。
因此在使用`AI翻译`时，可能需要进行按需调整提示词。
:::

## 百度翻译

- 百度翻译在翻译质量上也是非常不错的，但是在某些特殊情况下，可能会出现翻译不准确的情况。比如对于插值变量的处理，百度翻译可能会出现问题，此时需要手工进行调整。

- 百度翻译的API具有一定的免费额度，对调用频率也有一定的限制。一般需要配置`QPS=1`，即每秒调用一次。
- `VoerkaI18n`会对要翻译的文本进行合并后再调用，因此大部分情况下，均足够使用了。
