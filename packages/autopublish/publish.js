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


program
    .command("publish")
    .description("发布当前工作区下的包")
    .option("-f, --force", "强制发布") 
    .option("-q, --query", "询问是否发布，否则会自动发布") 
    .option("-i, --version-increment-step [value]", "版本增长方式，取值major,minor,patch",'patch')    
    .action(options => {
        const {versionIncrementStep} = options
        const packageFolder = process.cwd()        
        const pkgFile = path.join(packageFolder,"package.json")

        // 由于每次发布均会更新npm version patch，并且需要提交代码
        const lastCommit = shelljs.exec(`git log --format=%cd --date=iso -1 -- ${pkgFile}`, { silent: true }).stdout.trim()

        // 增加版本号
        shelljs.exec(`npm version ${versionIncrementStep}`, { silent: true }).stdout.trim()
        
        //
        shelljs.exec(`pnpm publish --access publish`, { silent: true }).stdout.trim()

    })

program
    .command("list")
    .description("列出各个包的最后一次提交时间和版本信息")
    .action(options => {
        assertInWorkspaceRoot()
       
        getPackages().forEach(package => {
            //console.log(`${package.name}`)
            if(package.lastCommit){
                console.log(`${package.name.padEnd(16)}\tVersion: ${package.version.padEnd(12)} lastCommit: ${dayjs(package.lastCommit).format("YYYY/MM/DD ")}(${dayjs(package.lastCommit).fromNow()}) `)
            }else{
                console.log(`${package.name.padEnd(16)}\tVersion: ${package.version.padEnd(12)} lastCommit: None `)
            }
        })
    })



program.parse(process.argv);
