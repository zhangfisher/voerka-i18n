# Webpack Loader<!-- {docsify-ignore-all} -->

`voerkai18n-loader`是一个标准的`webpack loader`用来实现在`webpack`下实现根据`idMap`文件自动映射翻译内容和自动导入`t`函数。主要功能：

- 自动读取当前工程`languages/idMap.(js|ts)`文件，将`t("xxxxx")`的待翻译内容转换为`t("1")`、`t("2")`、`t("<数字>")`形式，从而消除源码中的冗余文本。
- 根据配置,在`(js|ts|tsx|jsx)`等文件中从`languages`自动导入`t`函数。

## 安装

```shell
pnpm add -D voerkai18n-loader
npm install -D voerkai18n-loader
yarn add -D voerkai18n-loader
```

## 使用方法

`voerkai18n-loader`是一个标准的`webpack loader`,在任意使用`webpack`作为构建工具的环境下均可以使用。
关于如何安装配置`webpack loader`请参阅`webpack`的相关文档。

下面我们以使用`Create React App`创建的`React`应用为例介绍如何安装配置`voerkai18n-loader`。

### 第一步: 创建`React`应用

```shell
npx create-react-app myapp
```
### 第二步: 修改webpack配置

要修改使用`Create React App`创建的`React`应用的`webpack`配置有两种方法:

- **第一种：修改`react-scripts eject`命令输出的配置文件**

执行`react-scripts eject`命令，该命令会在当前工程的`config`文件下生成`webpack.config.js`。
打开`config/webpack.config.js`，在`module.rules`中添加一项：

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

也可以指定`voerkai18n-loader`配置参数。

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


- **第二种：使用`@craco/craco`配置**

`react-scripts eject`命令生成的`config/webpack.config.js`比较复杂，新手容易修改出问题来，这时可以使用`@craco/craco`。

[@craco/craco](https://github.com/dilanx/craco)是一个第三方库，可以在`React`应用不进行`eject`的情况下更加方便地修改`webpack`配置。

按照`@craco/craco`配置好`React`应用后，修改`craco.config.js`，如下：

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
  
## 配置参数 

`voerkai18n-loader`支持两个配置参数：

- **autoImport**

是否自动导入`t`函数，当在使用`js`开发时，可以通过配置`autoImport=true`来自动从当前应用的`languages`自动导入`t`函数。
如果您的是使用`typescript`开发，则不建议开启此功能，在此如果不导入`t`函数，会导致类型错误。

- **debug**

在控制台输出一些调试信息。