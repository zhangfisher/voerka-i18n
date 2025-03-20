# Automatic Translation

## Overview

The `voerkai18n translate` command is used to call online translation services to automatically translate extracted text.

## Basic Usage

```shell
voerkai18n translate [options]
```

## Options

| Option | Description |
| --- | --- |
| `--entry <path>` | Language working directory, default is `src/languages` |
| `--provider <provider>` | Translation service provider, default is `ai` |
| `--api <name>` | API name configured in api.json |
| `--api-url <url>` | API URL |
| `--api-key <key>` | API key |
| `--api-id <id>` | API ID |
| `--api-model <model>` | AI model name |
| `--debug` | Whether to enable debug mode |

## Translation Services

### AI Translation

From `voerkai18n 3.0`, AI translation is supported as a priority.

```shell
voerkai18n translate --api <name declared in api.json>
voerkai18n translate --api qwen
```

### Baidu Translation

```shell
voerkai18n translate --api baidu --provider baidu
```

## Configuration

### API Configuration

Configure API information in `languages/api.json`:

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

### Translation Prompts

Translation prompts are stored in `languages/prompts/`:

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

## Notes

1. AI translation quality depends on the model and prompts being used
2. Baidu Translation has a certain free quota and call frequency restrictions
3. The command will automatically merge new translations with existing ones
4. The command will not overwrite existing translations unless specified
