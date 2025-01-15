const {promisify} = require('node:util')
const childProcess  = require('node:child_process')
const execFile = promisify(childProcess.execFile);

/**
@param {string} command
@param {string[]} arguments_

@returns {Promise<import('child_process').ChildProcess>}
*/
async function exec(command, arguments_) {
	const subprocess = await execFile(command, arguments_, {encoding: 'utf8'});
	subprocess.stdout = subprocess.stdout.trim();
	return subprocess;
}

/**
@param {string} command
@param {string[]} arguments_

@returns {string}
*/
function execSync(command, arguments_) {
	return childProcess.execFileSync(command, arguments_, {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'ignore'],
	}).trim();
}
/**
 * 获取操作系统语言
 */
function getOsLanguage(){

}

/**
 * 
 * @param {Array} languages  语言列表
 */
 function getDefaultLanguage(languages){
    let index = languages.findIndex(lang=>lang.default)
    if(index>=0) return languages[index].name
    return languages[0].name
}
/**
 * 
 * @param {Array} languages  语言列表
 */
function getActiveLanguage(languages){
    let index = languages.findIndex(lang=>lang.active)
    if(index>=0) return languages[index].name
    return getDefaultLanguage(languages)
}


module.exports = {
	getOsLanguage,
	exec,
	execSync,
	getDefaultLanguage,
	getActiveLanguage
}