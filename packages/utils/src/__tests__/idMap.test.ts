import { describe, expect  } from 'vitest';
import { applyIdMap } from '../applyIdMap';

describe('idMap', () => {


})


// console.log(applyIdMap(String.raw`
//   t("aaa") 
//   t('bbb') 
//   t("ccc", {xxx:xxx})
//   t('ddd', [1,2,3,""])
//   t("eee", {xxx:xxx},{})
//   t('fff', [1,2,3,""],{})
//   t("ggg", {xxx:xxx},()=>{}) 
//   t('hhh', [1,2,3,""],()=>{})  
//   t('iii', [1,2,3,""],()=>{})  
// `,{
//     "aaa":"1",
//     "bbb":"2",
//     "ccc":"3",
//     "ddd":"4",
//     "eee":"5",
//     "fff":"6",
//     "ggg":"7",
//     "hhh":"8"    
// }))


// console.log(applyIdMap(`
//         <Translate vars="" message="aaa" options={}/>
//     <Translate message={"bbb"} />
//     <Translate message={\`ccc\`} />
//     <Translate vars="sss" message={\`ddd\`} />
//     <Translate vars="sss" message={()=>"Hello, world!"} />

//     <Translate 
//            message="fff"
//      ></Translate>
//     <Translate 
//               message={"ccc"}
//      ></Translate>
//     <Translate message={\`ddd!\`}></Translate>
//     <Translate vars="sss" message={\`eee\`} ></Translate>
// `,{
//         "aaa":"1",
//         "bbb":"2",
//         "ccc":"3",
//         "ddd":"4",
//         "eee":"5",
//         "fff":"6",
//         "ggg":"7",
//         "hhh":"8"    
// }))
 
