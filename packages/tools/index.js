const { Command } = require('commander');
const createLogger =  require("logsets")

const logger = createLogger()
const program = new Command();


program
    .option('-d, --debug', '输出调试信息') 

program
    .command('init')
    .argument('[location]', '工程项目所在目录')
    .description('初始化项目国际化配置')    
    .option('-r, --reset', '重新生成当前项目的语言配置')
    .option('-p, --langPath [name]', '语言包保存路径,默认<location>/langauges',"languages")  
    .option('-m, --moduleType [type]', '生成的js模块类型,默认esm',"esm")   
    .option('-lngs, --languages <languages...>', '支持的语言列表', ['cn','en']) 
    .action((location,options) => { 
        if(!location) location = process.cwd()
        const initializer = require("./initializer")
        options.debug=true
        initializer(location,options)
    });


program
    .command('extract')
    .description('扫描并提取所有待翻译的字符串到<languages/translates>文件夹中')
    .argument('[location]', 'js项目所在目录')
    .option('-d, --debug', '输出调试信息') 
    .option('-ls, --languages', '支持的语言', 'cn,en,de,fr,es,it,jp')  
    .option('-d, --default', '默认语言', 'cn')  
    .option('-a, --active', '激活语言', 'cn')  
    .option('-o, --output', '输出目录', './languages')
    .argument('<location...>', '工程所在目录')
    .action((location) => {
        if(!location) location = process.cwd()
        console.log('location=',location);
    });



program.parse(process.argv);

const options = program.opts(); 