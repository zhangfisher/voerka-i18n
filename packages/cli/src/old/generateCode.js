const ISO639 = require("iso-639-1-zh");
const fs = require("fs");

console.log(ISO639.getAllCodes()) // '中文'


const langTypes = []

fs.writeFileSync("lngTypes",ISO639.getAllCodes().join("' | '"))

console.log(ISO639.getZhName('zh')) // '中文'
console.log(ISO639.getZhName('es')) // '西班牙语'
console.log(ISO639.getLanguages(['en', 'es']))

