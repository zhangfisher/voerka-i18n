const path = require('path')

module.exports = {
    configureWebpack: {
        module:{
            rules:[
                {
                    test: [/^$/, /\.(js|vue)$/],
                    use:[
                        {
                            loader:"voerkai18n-loader",
                            // 可选的配置参数
                            options: {
                               autoImport:false,            // 是否自动导入t函数
                               debug:true,                 // 输出一些调试信息
                            }
                        }
                    ],                            
                    include: path.join(__dirname, 'src'),                  
                    enforce:'pre',
                } 
            ]
        }
      }
}