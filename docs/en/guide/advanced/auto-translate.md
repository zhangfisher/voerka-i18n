# Automatic Translation

Traditional internationalization solutions all require manual translation. `VoerkaI18n` supports calling online translation services for automatic translation.

**The `voerkai18n translate` command can call online translation services to automatically translate extracted text.**

In `VoerkaI18n 3.0`, two translation engines are supported:

- Baidu Translation
- AI Translation

Currently supports accessing the `Baidu Online API` for automatic translation. Baidu provides a free online API, although it only supports `QPS=1` (one call per second). However, the `voerkai18n translate` command merges the text to be translated before making the API call, which is sufficient for most cases.

## Basic Usage

Simply calling `voerkai18n translate` in your project directory will automatically translate all `JSON` files in the current project.

### Step 1: Apply for Online Translation Service API

- **Baidu Online Translation Service**

The Baidu online translation service can be found [here](https://fanyi-api.baidu.com/)

- **AI Translation Service**

Any online large language model service that provides `OpenAI API` compatible interfaces, such as `deepseek` or `Qwen`.

We recommend using `Qwen-max-latest`, which can be applied for [here](https://www.aliyun.com/product/tongyi?spm=5176.29956983.J_4VYgf18xNlTAyFFbOuOQe.d_menu_0.58424931lkYrnm)

:::warning Note
The above online translation services generally have some free quota, which is usually sufficient for small-scale translation.
:::

### Step 2: Configure API

After obtaining the API for the above translation services, configure the API access in `languages/api.json` as follows:

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

### Step 3: Execute Translation

- **AI Translation**

```shell
> voerkai18n translate --api <name declared in api.json>
> voerkai18n translate --api qwen
```

- **Baidu Translation**

```shell
> voerkai18n translate --api baidu --provider baidu
```

## AI Translation

`VoerkaI18n` requires that the large language model used for `AI Translation` supports `OpenAI API` compatible interfaces.

Generally, the translation quality of `AI Translation` is better than `Baidu Translation`.
However, the quality of `AI Translation` depends on the model being used, and different models may have varying translation quality. Additionally, the `prompt` used when submitting translations can also affect the translation results, especially when translating large blocks of text.

`VoerkaI18n` allows users to fine-tune the translation prompts.

<lite-tree>
myapp
    src
        languages
            prompts/        //!            Prompts
                tranlate-messages.md        //! Translation prompts
                translate-paragraphs.md  //! 
            api.json
            ... 
</lite-tree>

- `tranlate-messages.md` and `translate-paragraphs.md` are prompts for translating short sentences and paragraphs respectively, which users can adjust according to their needs.

:::warning Note
Since the quality of large model translation depends on the model and prompts being used, hallucinations may sometimes result in inaccurate translations.
Therefore, when using `AI Translation`, you may need to adjust the prompts as needed.
:::

## Baidu Translation

- Baidu Translation also provides very good translation quality, but in some special cases, there might be inaccurate translations. For example, Baidu Translation might have issues handling interpolation variables, which would require manual adjustment.

- Baidu Translation API has a certain free quota and also has restrictions on call frequency. Generally, you need to configure `QPS=1`, meaning one call per second.
- `VoerkaI18n` merges the text to be translated before making the API call, which is sufficient for most cases.
