const { Command } = require('commander');
const program = new Command();


program
    .option('-d, --debug', '输出调试信息') 

program
    .command('extract <source> [destination]')
    .description('扫描指定的项目目录，提取文件中的国际化字符串')
    .option('-d, --debug', '输出调试信息') 
    .option('-l, --languages', '支持的语言', 'cn,en,de,fr,es,it,jp')  
    .option('-d, --default', '默认语言', 'cn')  
    .option('-a, --active', '激活语言', 'cn') 
    .action((source, destination) => {
        console.log('clone command called');
    });



program.parse(process.argv);

const options = program.opts(); 