/**
 *    用于多包环境下的自动发布
 *  
 * 
 *  {
 *      scripts:{
 *          "publish":"autopublish [options]",
 *      }   
 *  } 
 */

 const fs = require("fs-extra");
 const path = require("path");
 const dayjs = require("dayjs");
 const shelljs = require("shelljs");
const shelljs = require("shelljs");
const createLogger = require("logsets");
const commander = require("commander");

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const logger = createLogger();


const program = commander()


program
    .version("1.0.0")
    .option("-v, --auto", "自动发布")
    .option("-a, --auto", "启用自动发布")
    .option("-p, --push []", "发布前执行git push")
    .option("-m, --commit [message]", "发布前执行git commit")
    .option("-v, --version", "默认版本升级，取值major,minor,patch")    
    .action((options) => {
        



    }))

