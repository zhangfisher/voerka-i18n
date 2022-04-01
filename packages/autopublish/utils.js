const shelljs = require("shelljs");
const path = require("path")

 

/**
 * 检测当前工程是否是git工程
 */
function isGitRepo(){
    return shelljs.exec("git status", {silent: true}).code === 0;
}


function getProjectName(){
    const pkgFile = path.join(process.cwd(), "package.json")
    const pkg = fs.readJSONSync(pkgFile);
    return pkg.name;
}


module.exports ={
    isMonorepo,
    isGitRepo
}