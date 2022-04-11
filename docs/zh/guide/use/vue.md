# Vue应用


在`Vue3`应用中引入`voerkai18n`来添加国际化应用需要由两个插件来简化应用。

- **@voerkai18n/vue**

  **Vue插件**，在初始化`Vue`应用时引入，提供访问`当前语言`、`切换语言`、`自动更新`等功能。

- **@voerkai18n/vite**

  **Vite插件**，在`vite.config.js`中配置，用来实现`自动文本映射`、`自动导入t函数`等功能。

  
`@voerkai18n/vue`和`@voerkai18n/vite`两件插件相互配合，安装配置好这两个插件后，就可以在`Vue`文件使用多语言`t`函数。

**重点：`t`函数会在使用`@voerkai18n/vite`插件后自动注入，因此在`Vue`文件中可以直接使用。**

```vue
<Script setup>
// 如果没有在vite.config.js中配置`@voerkai18n/vite`插件，则需要手工导入t函数
// import { t } from "./languages"
</Script>
<script>
export default {
    data(){
        return {
            username:"",
            password:"",
            title:t("认证")
        }
    },
    methods:{
        login(){
            alert(t("登录"))
        }
    }
}
</script>
<template>
	<div>
        <h1>{{ t("请输入用户名称") }}</h1>
        <div>
            <span>{{t("用户名:")}}</span><input type="text" :placeholder="t('邮件/手机号码/帐号')"/>
            <span>{{t("密码:")}}</span><input type="password" :placeholder="t('至少6位的密码')"/>            
    	</div>            
    </div>
        <button @click="login">{{t("登录")}}</button>
    </div>
</template>
```

**说明：**

- 事实上，就算没有`@voerkai18n/vue`和`@voerkai18n/vite`两件插件相互配合，只需要导入`t`函数也就可以直接使用。这两个插件只是很简单的封装而已。
- 如果要在应用中进行`语言动态切换`，则需要在应用中引入`@voerkai18n/vue`，请参阅`@voerkai18n/vue`插件使用说明。
- `@voerkai18n/vite`的使用请参阅后续说明。
