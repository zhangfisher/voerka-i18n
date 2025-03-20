# Command Line Tools

`voerkai18n` provides a command line tool for implementing text extraction/compilation and other functions.

## Installation

```shell
npm install -g @voerkai18n/cli
yarn global add @voerkai18n/cli
pnpm add -g @voerkai18n/cli
```

## Commands

| Command | Description |
| --- | --- |
| `voerkai18n init` | Initialize project |
| `voerkai18n extract` | Extract text that needs translation |
| `voerkai18n translate` | Call online translation service to translate |
| `voerkai18n compile` | Compile language packs |
| `voerkai18n apply` | Apply framework support |

## Command Options

### init

Initialize project

```shell
voerkai18n init [options]
```

**Options:**

| Option | Description |
| --- | --- |
| `--entry <path>` | Language working directory, default is `src/languages` |
| `--default <language>` | Default language, default is `zh-CN` |
| `--active <language>` | Active language, default is `en-US` |
| `--languages <languages>` | Supported languages, comma-separated, default is `zh-CN,en-US` |
| `--typescript` | Whether to use TypeScript |
| `--debug` | Whether to enable debug mode |

### extract

Extract text that needs translation

```shell
voerkai18n extract [options]
```

**Options:**

| Option | Description |
| --- | --- |
| `--entry <path>` | Language working directory, default is `src/languages` |
| `--debug` | Whether to enable debug mode |

### translate

Call online translation service to translate

```shell
voerkai18n translate [options]
```

**Options:**

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

### compile

Compile language packs

```shell
voerkai18n compile [options]
```

**Options:**

| Option | Description |
| --- | --- |
| `--entry <path>` | Language working directory, default is `src/languages` |
| `--debug` | Whether to enable debug mode |

### apply

Apply framework support

```shell
voerkai18n apply [options]
```

**Options:**

| Option | Description |
| --- | --- |
| `--entry <path>` | Language working directory, default is `src/languages` |
| `--framework <framework>` | Framework name, e.g., `vue`, `react`, `svelte`, etc. |
| `--debug` | Whether to enable debug mode |
