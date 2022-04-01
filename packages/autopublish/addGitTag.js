
/**
 * 
 *   读取当前项目的<package.json>.version,然后运行git tag [Version]在当前工程中添加版本tag
 * 
 *   添加会判断是否已经存在该版本标签，如果存在则不添加
 *   本脚本用在发布后自动添加版本标签
 * 
 *   addGitTag 
 * 
 *  {
 *      scripts:{
 *          "publish":"node version patch",
 *          // 在发布后在当前工程中添加版本标签
 *         "postpublish":"node addGitTag
 * "
 *      }
 *  
 *  }    
 */

const fs = require("fs-extra");
const path = require("path");
const dayjs = require("dayjs");
const shelljs = require("shelljs");

// 可选的，指定工程目录
const args  = process.argv.slice(2);
const projectFolder = args.length > 0 ? (path.isAbsolute(args[0]) ? args[0] : path.join(process.cwd(),args[0])) : process.cwd();

// 读取当前项目的package.json

const pkgFile = path.join(projectFolder, "package.json")
const pkg = fs.readJSONSync(pkgFile);

// 切换到当前目录
shelljs.cd(projectFolder);

// 读取当前版本
const tagInfo = shelljs.exec(`git describe --tags --match=V${pkg.version}`, {silent: true}).stdout.trim();
if(tagInfo.length===0){
    console.log(`未发现版本标签：V${pkg.version}`);
    if(shelljs.exec(`git tag V${pkg.version}`, {silent: false}).code>0){
        console.log(`添加版本标签<V${pkg.version}>失败`)
    }else{
        console.log(`已添加版本标签:V${pkg.version}`)
    }
}else {
    console.log(`已发现版本标签：${tagInfo}`);
}
// 更新








