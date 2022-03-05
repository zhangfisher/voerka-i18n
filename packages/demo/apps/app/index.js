import { t,languages,scope }   from "./languages/index.js"
 
VoerkaI18n.on((language)=>{
    console.log("切换到语言：",language)
})

async function output(){ 
    console.log(t("用户名或密码错误"))
    console.log(t('请输入用户名:'))
    console.log(t("请输入密码："))
    console.log(t("欢迎您: {}","张三丰"))
    console.log("----------------")
    await VoerkaI18n.change("en")
    console.log(t("用户名或密码错误"))
    console.log(t('请输入用户名:'))
    console.log(t("请输入密码："))
    console.log(t("欢迎您: {}","tom"))
    console.log("----------------")
    await VoerkaI18n.change("cn")
    console.log(t("用户名或密码错误"))
    console.log(t('请输入用户名:'))
    console.log(t("请输入密码："))
    console.log(t("欢迎您: {}","tom"))
}

output().then(()=>{})