# Webpack Integration

## Overview

`@voerkai18n/webpack` provides Webpack loader support for VoerkaI18n.

## Installation

```shell
npm install @voerkai18n/webpack --save-dev
yarn add @voerkai18n/webpack -D
pnpm add @voerkai18n/webpack -D
```

## Configuration

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: [
                    {
                        loader: '@voerkai18n/webpack',
                        options: {
                            entry: 'languages',
                            debug: false
                        }
                    }
                ]
            }
        ]
    }
}
```

## Options

The loader supports the following options:

```ts
interface VoerkaI18nWebpackLoaderOptions {
    entry?: string                         // Language entry path
    debug?: boolean                        // Whether to enable debug mode
}
```

## Notes

1. The Webpack loader is used to optimize the build process
2. It helps reduce the size of the final bundle by removing unnecessary code
3. It's recommended to use this loader in production builds
