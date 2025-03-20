# Babel Integration

## Overview

`@voerkai18n/babel` provides Babel plugin support for VoerkaI18n.

## Installation

```shell
npm install @voerkai18n/babel --save-dev
yarn add @voerkai18n/babel -D
pnpm add @voerkai18n/babel -D
```

## Configuration

```json
{
    "plugins": [
        ["@voerkai18n/babel"]
    ]
}
```

## Options

The plugin supports the following options:

```ts
interface VoerkaI18nBabelPluginOptions {
    entry?: string                         // Language entry path
    debug?: boolean                        // Whether to enable debug mode
}
```

## Notes

1. The Babel plugin is used to optimize the build process
2. It helps reduce the size of the final bundle by removing unnecessary code
3. It's recommended to use this plugin in production builds
