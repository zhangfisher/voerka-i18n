---
title: 日期时间
---
# 日期时间

`@voerkai18n/runtime`内置了对日期时间进行处理的格式化器，可以直接使用，不需要额外的安装。

```javascript
// 切换到中文
t("现在是{d | date}",new Date())   	// ==  现在是2022年3月12日
t("现在是{d | time}",new Date())   	// ==  现在是18点28分12秒
t("现在是{d | shorttime}",new Date())  // ==  现在是18:28:12
t("现在是{}",new Date())   			// ==  现在是2022年3月12日 18点28分12秒

// 切换到英文
t("现在是{d | date}",new Date())   // ==  Now is 2022/3/12
t("现在是{d | time}",new Date())   // ==  Now is 18:28:12
t("现在是{}",new Date())   		// ==  Now is 2022/3/20 19:17:24'
```
