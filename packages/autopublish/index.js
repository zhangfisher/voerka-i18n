/**
 *    用于多包环境下的自动发布
 *    
 *    autopublish 
 *  
 *  1.在package.json中添加scripts  
 *  {
 *      scripts:{
 *          "publish":"autopublish [options]",
 *      }   
 *  } 
 *  2. 参数
 *     -q: 默认情况下会比对最后一次发布的时间，来决定是否自动发布
 *         当-q参数被指定时，会询问用户
 * 
 * 
 * 
 * 
 */

 const fs = require("fs-extra");
 const inquirer = require("inquirer");

 const path = require("path");
 const shelljs = require("shelljs");
 const createLogger = require("logsets");
 const { Command } = require('commander');
 const dayjs = require("dayjs");
 const relativeTime = require("dayjs/plugin/relativeTime");
 dayjs.extend(relativeTime);
 
 const logger = createLogger();
 
 
 const program =new Command()
 
 
 
 const packages = [
     "git log --format=%cd --date=iso  -1 -- packages/babel/package.json",
     "git log --format=%cd --date=iso  -1 -- packages/cli/package.json",
     "git log --format=%cd --date=iso  -1 -- packages/runtime/package.json",
     "git log --format=%cd --date=iso  -1 -- packages/formatters/package.json",
     "git log --format=%cd --date=iso  -1 -- packages/vue/package.json",
     "git log --format=%cd --date=iso  -1 -- packages/vite/package.json",
     "git log --format=%cd --date=iso  -1 -- packages/autopublish/package.json",
     "git log --format=%cd --date=iso  -1 -- packages/utils/package.json"    
 ]
 
 function getPackages(){
     let workspaceRoot = process.cwd()        
     if(!fs.existsSync(path.join(workspaceRoot,"pnpm-workspace.yaml"))){
         console.log("命令只能在工作区根目录下执行")
         return
     }
      // 获取包最后一次提交的时间
     const getLastCommitScript = "git log --format=%cd --date=iso  -1 -- {packagePath}"
     return fs.readdirSync(path.join(workspaceRoot,"packages")).map(packageName=>{
         const pkgFile = path.join(workspaceRoot,"packages",packageName,"package.json")
         if(fs.existsSync(pkgFile)){
             const { name, version }= fs.readJSONSync(pkgFile)
             const lastCommit = shelljs.exec(getLastCommitScript.replace("{packagePath}",`packages/${packageName}/package.json`), { silent: true }).stdout.trim()
             return {
                 name,
                 version,
                 lastCommit
             }
         }
     }).filter(pkgInfo=>pkgInfo)
 }
 
 function assertInWorkspaceRoot(){
     const workspaceRoot = process.cwd()        
     if(!fs.existsSync(path.join(workspaceRoot,"pnpm-workspace.yaml"))){
         throw new Error("命令只能在工作区根目录下执行")
     }
 }
 
 /**
  * 返回当前包是否有未提交的文件
  * 
  * 如果包文件夹下有未提交的文件，则返回true
  * 
  */
 function getPackageLastChanges(packageName){
     const changeFiles = shelljs.exec(`git status -s .`, { silent: true }).stdout.trim()
     return changeFiles.length>0 ? changeFiles.split("\n") : []
 }
 
function execShellScript(script){
    if(shelljs.exec(script).code>0){
        throw new Error(`执行<${script}>失败`)
    }
}

 program
     .command("publish")
     .description("发布当前工作区下的包")
     .option("-f, --force", "强制发布") 
     .option("--no-auto-commit", "不提交源码") 
     .option("-q, --query", "询问是否发布，否则会自动发布") 
     .option("-i, --version-increment-step [value]", "版本增长方式，取值major,minor,patch",'patch')    
     .action(async (options) => {
         console.log(JSON.stringify(options))
         const {versionIncrementStep,autoCommit} = options
         const packageFolder = process.cwd()        
         const packageName = path.basename(packageFolder)
         const pkgFile = path.join(packageFolder,"package.json")
         
         const { scripts } = fs.readJSONSync(pkgFile)
 
         logger.log("包名：{}",`${packageName}`)
 
 
         //  第一步： 查询当否已经提交了代码，如果没有则提交代码
        const lastChanges = getPackageLastChanges(packageName)
        let lastCommit = shelljs.exec(`git log --format=%cd --date=iso -1 -- .`, { silent: true }).stdout.trim()
        if(lastCommit){
            lastCommit = dayjs(lastCommit)
            logger.log("最后一次提交：{}({})",lastCommit.format("YYYY-MM-DD HH:mm:ss"),lastCommit.fromNow())
        }
         if(lastChanges.length>0){
            logger.log("包[{}]存在{}个未提交的文件:",packageName,lastChanges.length)
            lastChanges.forEach(file=>logger.log(` - ${file.trim()}`))
            let isCommit = autoCommit
            if(!autoCommit){
                const result  = await inquirer.prompt({
                    name:"isCommit",
                    type:"confirm",
                    message:"是否提交未提交的文件？"
                })
                isCommit  = result.isCommit
            }
            if(isCommit){
                execShellScript(`git commit -a -m "Update ${packageName}"`)
            }
            

         }


 
 
         // 由于每次发布均会更新npm version patch，并且需要提交代码
        //  const lastCommit = shelljs.exec(`git log --format=%cd --date=iso -1 -- ${pkgFile}`, { silent: true }).stdout.trim()
 
        //  // 增加版本号
        //  shelljs.exec(`npm version ${versionIncrementStep}`, { silent: true }).stdout.trim()
         
        //  //
        //  shelljs.exec(`pnpm publish --access publish`, { silent: true }).stdout.trim()
 
     })
 
 program
     .command("list")
     .description("列出各个包的最后一次提交时间和版本信息")
     .action(options => {
         assertInWorkspaceRoot()        
         getPackages().forEach(package => {
             if(package.lastCommit){
                 console.log(`${package.name.padEnd(16)}\tVersion: ${package.version.padEnd(12)} lastCommit: ${dayjs(package.lastCommit).format("YYYY/MM/DD hh:mm:ss")}(${dayjs(package.lastCommit).fromNow()}) `)
             }else{
                 console.log(`${package.name.padEnd(16)}\tVersion: ${package.version.padEnd(12)} lastCommit: None `)
             }
         })
     })
 
 
 
 program.parseAsync(process.argv);
 

// inquirer
// 	.prompt([
// 		{
// 			type: "confirm",
// 			name: "autoPublish",
// 			message: "是否自动发布？",
// 			default: true,
// 		},
// 		{
// 			type: "checkbox",
// 			name: "selectPackages",
// 			message: "请选择要发布的库：",
// 			choices: packages,
// 			when: function (answer) {
// 				return !answer.autoPublish;
// 			},
// 		},
// 	])
// 	.then((answers) => {
// 		console.log(answers);
// 	})
// 	.catch((error) => {
// 		if (error.isTtyError) {
// 			// Prompt couldn't be rendered in the current environment
// 		} else {
// 			// Something else went wrong
// 		}
// 	});
