import path from "node:path";
import fs from "node:fs"; 
import Yaml from "js-yaml"





export function loadAstConfig(file:string,cwd:string = process.cwd()){  
     
    const includeType = new Yaml.Type('!include', {
        kind: 'scalar',
        resolve: (data:any) => typeof data === 'string',
        construct: (data:any) => {
        const filePath = data; // 获取文件路径
        const content = fs.readFileSync(path.join(cwd,"configs",filePath), 'utf8');
        return Yaml.load(content); // 递归解析
        },
    });
    
    const schema = Yaml.DEFAULT_SCHEMA.extend([includeType]);

    const configFile = path.join(cwd,"configs",file)
    const config     = fs.readFileSync(configFile, "utf-8")
    return Yaml.load(config,{ schema })
    
}