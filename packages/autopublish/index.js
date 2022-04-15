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
const TaskListPlugin = require("logsets/plugins/tasklist")
const TablePlugin = require("logsets/plugins/table")

const { Command ,Option} = require('commander');

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const { rejects } = require("assert");
const { Console } = require("console");
dayjs.extend(relativeTime);
require('dayjs/locale/zh-CN')
dayjs.locale("zh-CN");
 
const logger = createLogger();
logger.use(TaskListPlugin)
logger.use(TablePlugin)

const program =new Command()

 // 排除要发布的包
 const exclude_packages = ["autopublish"]

 function getPackages(){
     let workspaceRoot = process.cwd()        
     if(!fs.existsSync(path.join(workspaceRoot,"pnpm-workspace.yaml"))){
         console.log("命令只能在工作区根目录下执行")
         return
     }
     // 读取所有包
     let packages = fs.readdirSync(path.join(workspaceRoot,"packages")).map(packageName=>{
         const packageFolder = path.join(workspaceRoot,"packages",packageName)
         const pkgFile = path.join(workspaceRoot,"packages",packageName,"package.json")
         if(fs.existsSync(pkgFile)){
             const { name, version,lastPublish,dependencies,devDependencies }= fs.readJSONSync(pkgFile)
             // 读取工作区包依赖
             let packageDependencies =[]
             Object.entries({...dependencies,...devDependencies}).forEach(([name,version])=>{
                 if(version.startsWith("workspace:") && !exclude_packages.includes(name.replace("@voerkai18n/",""))){
                    packageDependencies.push(name)
                 }
             })
             return {
                 name,                                      // 完整包名
                 value:packageName,                         // 文件夹名称
                 version,
                 lastPublish,
                 isDirty: packageIsDirty(packageFolder),    // 包自上次发布之后是否已修改              
                 dependencies:packageDependencies           // 依赖的工作区包
             }
         }
     }).filter(pkgInfo=>pkgInfo && !exclude_packages.includes(pkgInfo.value))

     // 根据依赖关系进行排序
     for(let i=0;i<packages.length;i++){
            for(let j=i;j<packages.length;j++){
                let pkgInfo2 = packages[j]
                if( packages[i].dependencies.includes(pkgInfo2.name)){
                    let p = packages[i]
                    packages[i] = packages[j] 
                    packages[j] = p
                }
            }
     }
     // 如果某个包isDirty=true，则依赖于其的其他包isDirty=true
     packages.forEach(package => {
        if(package.isDirty){
            packages.forEach(p=>{
                if(p.name!==package.name && p.dependencies.includes(package.name)){
                    p.isDirty = true
                }
            })
        }
     })
     return packages
 }
 
 function assertInWorkspaceRoot(){
     const workspaceRoot = process.cwd()        
     if(!fs.existsSync(path.join(workspaceRoot,"pnpm-workspace.yaml"))){
         throw new Error("命令只能在工作区根目录下执行")
     }
 }

 function assertInPackageRoot(){
    const currentFolder = process.cwd()
    const workspaceRoot = path.join(currentFolder,"../../")

    const inPackageRoot = fs.existsSync(path.join(currentFolder,"package.json")) && fs.existsSync(path.join(workspaceRoot,"pnpm-workspace.yaml"))
 
    if(!inPackageRoot){ 
        throw new Error("命令只能在工作区的包目录下执行")
    }
}
 
 /**
  * 执行脚本，出错会返回错误信息
  * @param {*} script 
  */
function execShellScript(script,options={}){
    let {code,stdout} = shelljs.exec(script,options)
    if(code>0){
        new Error(`执行<${script}>失败: ${stdout.trim()}`)
    }
}
/**
 * 异步执行脚本
 * @param {*} script 
 * @param {*} options 
 * @returns 
 */
async function asyncExecShellScript(script,options={}){
    return new Promise((resolve,reject)=>{
        shelljs.exec(script,{...options,async:true},(code,stdout)=>{
            if(code>0){
                reject(new Error(`执行<${script}>失败: ${stdout.trim()}`))
            }else{
                resolve()
            }
        })   
    }) 
}
 /**
  * 执行脚本并返回结果
  * @param {*} script 
  */
function execShellScriptReturns(script,options={}){
    return shelljs.exec(script,options).stdout.trim()
}

/**
 * 读取指定包最近一次更新的时间
 * 通过遍历所有文件夹
 * @param {*} folder 
 * @returns 
 */
 function getFolderLastModified(folder,patterns=[],options={}){    
    patterns.push(...[
        "package.json",
        "**",
        "**/*",
        "!node_modules/**",
        "!node_modules/**/*",
        "!**/node_modules/**",
        "!**/node_modules/**/*",
    ])

    const glob = require("fast-glob")
    let files = glob.sync(patterns, {
        cwd: folder,
        absolute:true,
        ...options
    }) 
    let lastUpdateTime = null
    for(let file of files){
        const { mtimeMs } = fs.statSync(file)
        lastUpdateTime = lastUpdateTime ? Math.max(lastUpdateTime,mtimeMs) : mtimeMs
    }
    return lastUpdateTime 
} 

function getFileLastModified(file){
    const { mtimeMs } = fs.statSync(file)
    return mtimeMs
}

/**
 * 
 * @param {*} packageInfo   {name:"@voerkai18n/autopublish",value:"",version:"1.0.0",lastPublish:"2020-05-01T00:00:00.000Z"}
 */
async function runPackageScript(workspaceRoot,packageInfo,{silent=false}={}){
    const packageFolder = path.join(workspaceRoot,"packages",packageInfo.value)
    const package = fs.readJSONSync(path.join(packageFolder,"package.json"))
    const lastModified = getFolderLastModified(packageFolder)
    // 进入包所在的文件夹
    shelljs.cd(packageFolder)                   
    // 每个包必须定义自己的发布脚本
    if("release" in package.scripts){
        await asyncExecShellScript(`pnpm release`,{silent})
    }else{
        const reason = `包[{}]没有定义自动发布脚本release`
        if(showLog) logger.log(reason,package.name)
        throw new Error(`未配置<release>脚本`)
    }
}


/**
 * 
 * 返回指定包自上次发布之后是否有更新过
 * 
 * @param {*} packageFolder
 * 
 * 
 */
function packageIsDirty(packageFolder){
    const pkgFile = path.join(packageFolder,"package.json")
    if(!fs.existsSync(pkgFile)){
        logger.log("当前包[{}]不存在package.json文件",packageFolder)
        throw new Error("当前包不存在package.json文件")
    }
    const package = fs.readJSONSync(pkgFile)
    const lastModified = getFolderLastModified(packageFolder)
    const lastPublish = package.lastPublish
    // 由于上一次发布时会更新package.json文件，如果最后更新的文件时间==package.json文件最后更新时间，则说明没有更新
    const pkgLastModified =  getFileLastModified(pkgFile)

    return dayjs(lastModified).isAfter(dayjs(lastPublish)) && !dayjs(pkgLastModified).isSame(dayjs(lastModified))
}

/**
 * 发布所有包
 * 
 * 将比对最后发布时间和最后修改时间的差别来决定是否发布
 * 
 * 
 * @param {*} packages 
 */
async function publishAllPackages(packages,options={}){
   const tasks = logger.tasklist()
   const workspaceRoot = process.cwd()
   // 依次对每个包进行发布
   for(let package of packages){
        tasks.add(`发布包[${package.name}]`)
        try{
            if(package.isDirty){
                await runPackageScript(workspaceRoot,package,{silent:true,...options})
                let { version } = fs.readJSONSync(path.join(workspaceRoot,"packages",package.value,"package.json"))
                tasks.complete(`${package.version}->${version}`)
            }else{
                tasks.skip()
            }            
        }catch(e){
            tasks.error(`${e.message}`)
        }
   }
}



/**
 * 发布包，并且在package.json中记录最后发布时间
 * 本命令只能在包文件夹下执行
 * @param {*} options 
 */
async function publishPackage(options){
    const { versionIncrementStep,silent=true } = options
    
    // 此命令需要切换到包所在目录
    const packageFolder = process.cwd()        
    const packageName = path.basename(packageFolder)
    const pkgFile = path.join(packageFolder,"package.json")
    
    if(!fs.existsSync(pkgFile)){
        logger.log("当前包[{}]不存在package.json文件",packageName)
        throw new Error("当前包不存在package.json文件,请在包文件夹下执行")
    }

    let package = fs.readJSONSync(pkgFile)
    const oldVersion = package.version
    let packageBackup = Object.assign({},package)             // 备份package.json，当操作失败时，还原

    logger.log("发布包：{}",`@voerkai18n/${packageName}`)   
    
    const tasks = logger.tasklist()

    try{
        //  第一步： 更新版本号和发布时间
        tasks.add("更新版本号")
        await asyncExecShellScript(`npm version ${versionIncrementStep}`,{silent})
        // 重新读取包        
        package = fs.readJSONSync(pkgFile)
        packageBackup = Object.assign({},package)
        tasks.complete(`${oldVersion}->${package.version}`)   

        // 第二步：构建包
        if("build" in package.scripts){
            tasks.add("构建包")
            await asyncExecShellScript(`pnpm build`,{silent})
            tasks.complete()
        }
        

        // 第三步：发布
        // 由于工程可能引用了工作区内的其他包，必须pnpm publish才能发布
        // pnpm publish会修正引用工作区其他包到的依赖信息，而npm publish不能识别工作区内的依赖，会导致报错        
        tasks.add("发布包")
        await asyncExecShellScript(`pnpm publish --no-git-checks --access public`,{silent})            
        tasks.complete()        

        // 第四步：更新发布时间
        tasks.add("更新发布时间")
        package.lastPublish = dayjs().format()
        fs.writeFileSync(pkgFile,JSON.stringify(package,null,4))
        tasks.complete()

    }catch(e){// 如果发布失败，则还原package.json        
        fs.writeFileSync(pkgFile,JSON.stringify(packageBackup,null,4))
        tasks.error(`${e.message}`)
    }

}



program
    .command("list")
    .description("列出各个包的最后一次提交时间和版本信息")
    .action(options => {
         assertInWorkspaceRoot()         
         workspaceRoot = process.cwd()
         const table = logger.table({grid:1})
         table.addHeader("包名","版本号","最后提交时间","最后修改时间")
         getPackages().forEach(package => {
            const lastPublish = package.lastPublish ? dayjs(package.lastPublish).format("MM/DD hh:mm:ss") : "None"
            const lastPublishRef = package.lastPublish ? `(${dayjs(package.lastPublish).fromNow()})` : ""
            const lastModified = getFolderLastModified(path.join(workspaceRoot,"packages",package.value))
            const lastUpdate = dayjs(lastModified).format("MM/DD hh:mm:ss")                        
            const lastUpdateRef = dayjs(lastModified).fromNow()      
             if(package.lastPublish){
                table.addRow(package.name,package.version,`${lastPublish}(${lastPublishRef})`,`${lastUpdate}(${lastUpdateRef})`)
             }else{
                table.addRow(package.name,package.version,"None",`${lastUpdate}(${lastUpdateRef})`)
             }
         })
         table.render()
    })
 


async function answerForSelectPackages(packages,options){
    const workspaceRoot = process.cwd()
    return new Promise((resolve,reject) => {
        inquirer
            .prompt([
                {
                    type: "checkbox",
                    name: "selectPackages",
                    message: "请选择要发布的库：",
                    choices: packages.map(package => {
                        const lastPublish = package.lastPublish ? dayjs(package.lastPublish).format("MM/DD hh:mm:ss") : "None"
                        const lastPublishRef = package.lastPublish ? `(${dayjs(package.lastPublish).fromNow()})` : ""
                        const lastModified = getFolderLastModified(path.join(workspaceRoot,"packages",package.value))
                        const lastUpdate = dayjs(lastModified).format("MM/DD hh:mm:ss")                        
                        const lastUpdateRef = dayjs(lastModified).fromNow()        
                        return {
                            ...package,
                            value: package,
                            name:`${package.name.padEnd(24)}Version: ${package.version.padEnd(8)} LastPublish: ${lastPublish.padEnd(16)}${lastPublishRef} lastModified: ${lastUpdate}(${lastUpdateRef})`,                        }
                    }),
                    pageSize:12,
                    loop: false 
                },
            ])
            .then((answers) => {                            
                resolve(answers.selectPackages)
            })
            .catch((error) => {
                logger.log(error.message)
                reject(error)
            });
    })
}
/**
 *  发布包的模式
 * 
 *   1. 在包中使用
 *  {
 *      scripts:{
 *          "release":"pnpm autopublish"
 *      }
 *  }   
 * 
 *   2. 发布所有包
 *   {
 *      scripts:{
 *          "autopublish":"pnpm autopublish -a"
 *      } 
 *   }
 *   > pnpm autopublish -- -a                   // 自动发布，会询问要发布的  
 *   > pnpm autopublish -- -a --no-ask          // 自动发布，不会询问全自动发布
 * 
 */
const VERSION_STEPS = ["major", "minor", "patch","premajor","preminor","prepatch","prerelease"]
program
     .description("自动发布包")
     .option("-a, --all", "发布所有包")
     .option("-n, --no-ask", "不询问")
     .option("-s, --no-silent", "静默显示脚本输出")
     .addOption(new Option('-i, --version-increment-step [value]', '版本增长方式').default("patch").choices(VERSION_STEPS))
     .action(async (options) => {        
         console.log("options.all=",options.all)
        // 发布所有包时只能在工作区根目录下执行
        if(options.all){
            assertInWorkspaceRoot()        
        }else{// 发布指定包时只能在包目录下执行
            assertInPackageRoot()                   
        }        
        if(options.all){  // 自动发布所有包
            const workspaceRoot = process.cwd()       
            let packages = getPackages()
            if(options.ask){
                packages = await answerForSelectPackages(packages,options)
            }
            if(packages.length > 0){
               await publishAllPackages(packages,options)
            }
        }else{// 只发布指定的包
            await publishPackage(options)
        }
     })

 program.parseAsync(process.argv);
 
 