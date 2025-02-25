

export type VoerkaI18nMessagePatchArgs = {
    language  : string
    message   : string
    scope     : string
    id        : string
}

export type VoerkaI18nMessagePatchableOptions = { 
    enable?     : boolean
    url?        : string | undefined        // 提交补丁的地址
    showMark?   : boolean                   // 是否为翻译组件添加可视化标识，如显示为黄色背景等    
}
