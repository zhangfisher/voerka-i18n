# Compile Language Packs

## Overview

The `voerkai18n compile` command is used to compile language packs.

## Basic Usage

```shell
voerkai18n compile [options]
```

## Options

| Option | Description |
| --- | --- |
| `--entry <path>` | Language working directory, default is `src/languages` |
| `--debug` | Whether to enable debug mode |

## Compilation Process

### Step 1: Compile Regular Text

The command will compile all JSON files in `languages/translates/messages/` into language pack files:

```javascript
// languages/messages/zh-CN.js
export default {
    "1": "中华人民共和国",
    "2": "中华人民共和国万岁"
}

// languages/messages/en-US.js
export default {
    "1": "People's Republic of China",
    "2": "Long live the People's Republic of China"
}
```

### Step 2: Compile Paragraphs

The command will compile all HTML files in `languages/translates/paragraphs/` into paragraph files:

```javascript
// languages/paragraphs/license.js
export default {
    "zh-CN": "...",
    "en-US": "..."
}
```

### Step 3: Generate ID Map

The command will generate an ID map file:

```javascript
// languages/messages/idMap.js
export default {
    "中华人民共和国": "1",
    "中华人民共和国万岁": "2"
}
```

## Notes

1. The command will automatically create necessary directories
2. The command will not overwrite existing files unless necessary
3. The command will generate TypeScript files if TypeScript is enabled
4. The command will optimize the output for production use
