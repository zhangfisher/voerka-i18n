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
 const semver = require("semver")
 const path = require("path");
 const shelljs = require("shelljs");
 const createLogger = require("logsets");
 const { Command ,Option} = require('commander');
 const dayjs = require("dayjs");
 const relativeTime = require("dayjs/plugin/relativeTime");
 dayjs.extend(relativeTime);
 require('dayjs/locale/zh-cn')
 dayjs.locale("zh-cn");
 
 const logger = createLogger();
 
 
 const program =new Command()
 
 
 
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
 
 /**
  * 执行脚本，出错会返回错误信息
  * @param {*} script 
  */
function execShellScript(script,options={}){
    if(shelljs.exec(script).code>0){
        throw new Error(`执行<${script}>失败`)
    }
}
 /**
  * 执行脚本并返回结果
  * @param {*} script 
  */
function execShellScriptReturns(script,options={}){ ){
    return shelljs.exec(script,options).code>0).stdout.trim()
}


/**
 * 执行Git提交命令
 * 
 * 1. 检查当前包是否有未提交的文件
 * 2. 如果没有则不提交
 * 3. 如果有则提交
 * 
 * 
 */
function commitProject(packageName,{versionIncrementStep="patch",autoCommit=false}={}){
    const lastChanges = getPackageLastChanges(package.name)
    let lastCommit = shelljs.exec(`git log --format=%cd --date=iso -1 -- .`, { silent: true }).stdout.trim()
    let hasError = false                // 执行过程是否出错了
    let isCommit = autoCommit           // 是否执行了提交操作

    if(lastCommit){
        lastCommit = dayjs(lastCommit)
        logger.log("最后一次提交：{}({})",lastCommit.format("YYYY-MM-DD HH:mm:ss"),lastCommit.fromNow())
    }
    if(lastChanges.length>0){
        logger.log("包[{}]存在{}个未提交的文件:",package.name,lastChanges.length)
        lastChanges.forEach(file=>logger.log(` - ${file.trim()}`))  
        if(!autoCommit){
            const result  = await inquirer.prompt({
                name:"isCommit",
                type:"confirm",
                message:"是否提交以上文件到仓库？"
            })
            isCommit  = result.isCommit
        }
        if(isCommit){
            execShellScript(`git commit -a -m "Update ${package.name}"`)           
        }
    }
}

let VERSION_STEPS = ["major", "minor", "patch","premajor","preminor","prepatch","prerelease"]
program
     .command("publish")
     .description("发布当前工作区下的包")
     .option("-p, --package-name", "包名称") 
     .option("-f, --force", "强制发布") 
     .option("--no-auto-commit", "不提交源码") 
     .option("-q, --query", "询问是否发布，否则会自动发布") 
     .option("--no-add-version-tag", "不添加版本标签") 
     .addOption(new Option('-i, --version-increment-step [value]', '版本增长方式').default("patch").choices(VERSION_STEPS))
     .action(async (options) => {
         console.log(JSON.stringify(options))
         const {versionIncrementStep,autoCommit,addVersionTag} = options
        
         const packageFolder = process.cwd()        
         const packageName = path.basename(packageFolder)
         const pkgFile = path.join(packageFolder,"package.json")
         const package = fs.readJSONSync(pkgFile)
         const packageBackup = Object.assign({},package) // 备份package.json，当操作失败时，还原
        
         logger.log("将发布包：{}",`${packageName}`) 
 
        //  第一步： 提交代码         
        commitProject(package,options)
        
        //  第二步： 更新版本号和发布时间
        package.version = semver.inc(package.version,versionIncrementStep)
        package.lastPublish = dayjs().format()
        fs.writeJSONSync(pkgFile,package)


 
 
  
        // 第三步：执行发布到Npm
        // 由于工程可能引用了工作区内的其他包，必须pnpm publish才能发布
        // pnpm publish会修正引用工作区其他包到的依赖信息，而npm publish不能识别工作区内的依赖，会导致报错        
        try{
            execShellScript(`pnpm publish --no-git-checks --access publish`)            
            // 当发布完毕后，由于更新了publish，因此需要重新提交代码
        }catch{
            fs.writeJSONSync(pkgFile,packageBackup)
        }

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
