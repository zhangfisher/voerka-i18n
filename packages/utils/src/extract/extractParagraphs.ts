import { parse, Lang, SgNode, Range } from '@ast-grep/napi' 

export type paragraphRegexp = ''


function parseTranslateAttrs(code:string){
    
}

/**
 * 
 * 提取段落
 * 
 * <Translate>
 *   段落内容
 * </Translate>
 * 
 * @param code 
 */
export function extractParagraphs(code:string){

    const translatesAst = parse(Lang.Tsx,code)        
    const nodes = translatesAst.root().findAll({
        rule:{
            pattern: "<Translate $$$>$$$</Translate>"
        }
    })
    
    


}