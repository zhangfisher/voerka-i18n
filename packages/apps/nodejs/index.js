const { t } = require("./languages");
t("a");
t("b");
t("c");
t("d");
t("e");
cn_messages = t("一{}") + t("二") + t("三") + t("四") + t("五");

console.log(t("这是一个测试:{a}+{b | x}={c}", { a: 1, b: 2, c: 3 }));

console.log("END");
