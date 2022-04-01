/**
 *
 *  自动发布工具
 *   
 *  自动读取当前项目的版本标签，如果不致则进行
 *   
 * 
 *   
 *   支持两种发布方式：
 *
 *   1. 自动发布
 *
 *    当选择自动发布时，会读取当前项目下的所有文件，然后
 *
 *    根据每个包的最后提交时间和最近一次发布来决定是否自动发布
 *    每个包发布时均需要修改package.json.lastPublish值
 *
 *  2. 手动发布
 *    手动选择要发布的包
 *  
 *  pnpm add @voerkai18n/autopublish
 *  
 *  // 自动发布
 *  autopublish 
 *
 */

const inquirer = require("inquirer");
const fs = require("fs-extra");
const shelljs = require("shelljs");
const path = require("path");
const createLogger = require("logsets");
const commander = require("commander");

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const logger = createLogger();


const program = commander()


program
    .version("1.0.0")
    .option("-a, --auto", "自动发布")
    .option("-a, --auto", "启用自动发布")
    .option("-m, --monorepo", "是否是monorepo工程")
    .option("-i, --independent", "每个包独立发布")
    .option("-e, --excludePackages", "多包场景时忽略的包")    
    .action((options) => {
        



    }))




// 读取packages所有包

let excludePackages = ["apps"];

let packages = [];

fs.readdirSync(path.join(__dirname, "packages")).forEach(function(packageName){
	if (excludePackages.includes(packageName)) return;
	const packageFolder = path.join(__dirname, "packages", packageName);
    // 读取指定包
	const { version: packageVersion,lastPublishTime } = require(path.join(packageFolder,"package.json"));
    // 最后一次提交的时间
	const packageLastCommitTime = shelljs.exec(`git log -1 --format=%cd --date=iso ${packageFolder}`, {silent: true}).stdout.trim();
    // 最后发布的时间
	packages.push({
		name: `@voerkai18n/${packageName.padEnd(20)}\t\t( Version:${packageVersion}, LastCommit: ${dayjs(packageLastCommitTime).fromNow()})`,
		value: {
			packageFolder,
			lastCommitTime: packageLastCommitTime,
			version: packageVersion,
		},
	});
});

inquirer
	.prompt([
		{
			type: "confirm",
			name: "autoPublish",
			message: "是否自动发布？",
			default: true,
		},
		{
			type: "checkbox",
			name: "selectPackages",
			message: "请选择要发布的库：",
			choices: packages,
			when: function (answer) {
				return !answer.autoPublish;
			},
		},
	])
	.then((answers) => {
		console.log(answers);
	})
	.catch((error) => {
		if (error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
		} else {
			// Something else went wrong
		}
	});
