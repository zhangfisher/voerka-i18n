const tasks = logger.tasklist("检测VoerkaI18n最新版本")   
const packages = [
    "@voerkai18n/cli",
    "@voerkai18n/runtime",
    "@voerkai18n/vue",
    "@voerkai18n/react",
    "@voerkai18n/vite",
    "@voerkai18n/babel",
    "voerkai18n-loader"
]
let needUpgrades = []
for(let package of packages){
    try{
        let info = getInstalledPackageInfo(package)
        tasks.add(`${package}(${info ? info.version : logger.colors.red('未安装')})`)
        let newInfo = await getPackageReleaseInfo(package)
        if(info){
            if(semver.gt(newInfo.latestVersion,info.version)){
                needUpgrades.push(package)
                tasks.fail(info.version)
            }else if(newInfo.version == info.version){
                tasks.complete("NEWEST")
            }else{
                tasks.skip("UNKNOWN")
            }                
        }else{
            tasks.fail(newInfo.version)
        }                
    }catch(e) {
        tasks.error(e.stack)
    }        
}
// 
if(needUpgrades.length>0){
    logger.log(logger.colors.red("\n请将{}升级到最新版本！",needUpgrades.join(","))) 
}