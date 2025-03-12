// fork from https://github.com/sindresorhus/os-locale
const lcid = require('lcid')  
const { getVoerkaI18nSettings } = require('@voerkai18n/utils');
const defaultOptions = {spawn: true};
const defaultLocale = 'en-US';
const childProcess = require('child_process');
 
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

function getStdOutSync(command, args) {
	return execSync(command, args);
}

function getEnvLocale(env = process.env) {
	const lang =  env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES ;
	return lang ? normalize(lang.split('.')[0]) : null;
}

function parseLocale(string) {
	const env = {};
	for (const definition of string.split('\n')) {
		const [key, value] = definition.split('=');
		env[key] = value.replace(/^"|"$/g, '');
	}

	return getEnvLocale(env);
}

function getLocale(string) {
	return (string && string.replace(/[.:].*/, ''));
}
 
function getLocalesSync() {
	return getStdOutSync('locale', ['-a']);
}

function getSupportedLocale(locale, locales = '') {
	return locales.includes(locale) ? locale : defaultLocale;
} 

function getAppleLocaleSync() {
	return getSupportedLocale(
		getStdOutSync('defaults', ['read', '-globalDomain', 'AppleLocale']),
		getLocalesSync(),
	);
}
 

function getUnixLocaleSync() {
	return getLocale(parseLocale(getStdOutSync('locale')));
}
 

function getWinLocaleSync() {
	const stdout = getStdOutSync('wmic', ['os', 'get', 'locale']);
	const lcidCode = Number.parseInt(stdout.replace('Locale', ''), 16);

	return lcid.from(lcidCode);
}

function normalize(input) {
	return input.replace(/_/, '-');
}

const cache = new Map();
 

function osLocaleSync(options = defaultOptions) {
	if (cache.has(options.spawn)) {
		return cache.get(options.spawn);
	}
	let locale;
	try {
		const envLocale = getEnvLocale();
		if(envLocale){
			locale = envLocale
		}else{
			if(process.platform === 'win32') {
				locale = getWinLocaleSync(); 
			} else if (process.platform === 'darwin') {
				locale = getAppleLocaleSync();
			} else {
				locale = getUnixLocaleSync();
			}
		}		
	} catch{}

	const normalised = normalize(locale || defaultLocale);
	cache.set(options.spawn, normalised);
	return normalised;
}


function getCliLanguage(){    
	const settings = getVoerkaI18nSettings() 
	const supportedLanguages = settings.languages || []
    let result 
    const envLang = process.env.LANGUAGE;
    if(envLang){
        result = envLang.trim()
    }else{
		result = osLocaleSync()
    }
	if(supportedLanguages.length > 0 && !supportedLanguages.some(lng=>lng.name==result) ){
		result = "en-US"
	}
    return result
}


module.exports = {
    getCliLanguage
}