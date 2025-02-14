
export const jsConfig = {
    rule: {
        any: [
            { pattern: { selector: "call_expression", context: "t($MESSAGE)" } },
            { pattern: { selector: "call_expression", context: "t($MESSAGE,$VARS)" } },
            { pattern: { selector: "call_expression", context: "t($MESSAGE,$VARS,$OPTIONS)" } },
        ]
    },   
    constraints:{
        MESSAGE:{
            kind: "string"
        },
        OPTIONS:{
            kind: "object"
        }
    }    
} 

export const tsConfig = jsConfig
