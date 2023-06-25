# Webpack Loader<!-- {docsify-ignore-all} -->

 `voerkai18n-loader` Is a standard `webpack loader` function used to implement automatic mapping, translation and import `t` according to `idMap` the `webpack` file. Main functions:

- Automatically read the current project `languages/idMap.(js|ts)` file and `t("xxxxx")` convert the content to be translated into `t("1")` the form of, `t("2")`, `t("<数字>")`, so as to eliminate the redundant text in the source code.
- Depending on the configuration, `(js|ts|tsx|jsx)` functions are automatically imported `t` from `languages` in files such as.

## Installation

```shell
pnpm add -D voerkai18n-loader
npm install -D voerkai18n-loader
yarn add -D voerkai18n-loader
```

## How to use

 `voerkai18n-loader` Is a standard `webpack loader` and can be used in any environment where it is used `webpack` as a build tool. See `webpack` the documentation for how to install and configure `webpack loader`.

Let's take the `React` application created by using `Create React App` as an example to introduce how to install the configuration `voerkai18n-loader`.

### Step 1: Create `React` an application

```shell
npx create-react-app myapp
```
### Step 2: Modify the web pack configuration

There are two ways to modify the configuration of an app `webpack` created `React` with `Create React App`:

- ** The first is to modify `react-scripts eject` the configuration file ** output by the command.

Execute `react-scripts eject` the command, which will be generated `webpack.config.js` under the file of `config` the current project. Open `config/webpack.config.js` to `module.rules` add an entry to:

```javascript
// config/webpack.config.js

{
    module:{
        rules:[
            {
                test: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/],
                loader:"voerkai18n-loader",
                include: paths.appSrc,
                enforce:'pre',
            }
            //...其他规则 
        ]
    }
}
```

You can also specify `voerkai18n-loader` configuration parameters.

```javascript
// config/webpack.config.js
{
    module:{
        rules:[
            {
                test: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/],
                use:[
                    {
                        loader:"voerkai18n-loader",
                        // 可选的配置参数
                        options: {
                           autoImport:false,            // 是否自动导入t函数
                           debug:false,                 // 输出一些调试信息
                        }
                    }
                ],		                    
                include: paths.appSrc,                  // 只转换
                enforce:'pre',
            }
            //...其他规则 
        ]
    }
}
```


- ** Second: Use `@craco/craco` Configuration **

 `react-scripts eject` Command generation `config/webpack.config.js` is more complex, and it is easy for novices to modify problems, which can be used `@craco/craco` at this time.

[ @craco/craco](https://github.com/dilanx/craco) Is a third-party library that makes `React` it easier to modify `webpack` the configuration without `eject` the application.

After the application is completed `React` according to `@craco/craco` the configuration, modify `craco.config.js` as follows:

```javascript
module.exports = {
	webpack: {
		configure:(config, { env, paths })=>{
		    config.module.rules.push(
		                {
		                    test: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/],
                            use:[
                                {
                                    loader:"voerkai18n-loader",
                                    options: {
                                        autoImport:true,
                                        debug:true
                                    }
                                }
                            ],		                    
                            include: paths.appSrc,
		                    enforce:'pre',
		            }
		    )
		    return config
		} 
    }
}
```
  
## Configuration parameters

Two configuration parameters are `voerkai18n-loader` supported:

- ** autoImport **

Whether to automatically import `t` functions. When using `js` development, you can configure `autoImport=true` to automatically import `t` functions from the `languages` current application. If you are using `typescript` development, it is not recommended to enable this function. If you do not import `t` the function here, it will cause a type error.

- ** debug **

Output some debugging information at the console.