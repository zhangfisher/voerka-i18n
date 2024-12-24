/**
 * 插值变量格式化器测试
 */
import {
  test,
  vi,
  describe,
  expect,
  afterAll,
  beforeAll,
  beforeEach,
} from "vitest";
import { VoerkaI18nScope } from "../scope";
import { VoerkaI18nTranslate } from "../types";
import { createI18nScope } from "./utils";

let scope: VoerkaI18nScope;
let t: VoerkaI18nTranslate;

describe("插值变量使用格式化器", () => {
  beforeAll(() => {
    return new Promise((resolve) => {
      scope = createI18nScope({
        ready: resolve,
      });
      t = scope.t;
      // 注册格式化器，注册为所有语言
      scope.registerFormatter("add", (value, args, config) => {
        return String(Number(value) + Number(args.length == 0 ? 1 : args[0]));
      });
      scope.formatterManager.updateConfig("zh", {
        bookname: {
          beginChar: "《",
          endChar: "》",
        },
      });
      scope.formatterManager.updateConfig("en", {
        bookname: {
          beginChar: "<",
          endChar: ">",
        },
      });
      // 注册格式化器，注册为所有语言
      scope.registerFormatter("bookname", (value, args, config) => {
        let { beginChar = "<", endChar = ">" } = Object.assign(
          {},
          (config as any)?.bookname
        );
        if (args.length == 1) {
          beginChar = endChar = args[0];
        } else if (args.length >= 2) {
          beginChar = args[0];
          endChar = args[1];
        }
        return beginChar + value + endChar;
      });
    });
  });
  beforeEach(async () => {
    await scope.change("zh");
  });
  test("基本格式化器的使用", async () => {
    expect(t("我的工资是每月{|add}元", 1000)).toBe("我的工资是每月1001元");
    expect(t("我的工资是每月{|add()}元", 1000)).toBe("我的工资是每月1001元");
    expect(t("我的工资是每月{|add(2)}元", 1000)).toBe("我的工资是每月1002元");
    // 链式调用
    expect(t("我的工资是每月{|add|add()|add(2)}元", 1000)).toBe("我的工资是每月1004元");
  });
  test("bookname式化器", async () => {
    expect(t("hello {|bookname}", "tom")).toBe("hello 《tom》");
    expect(t("hello {|bookname('#')}", "tom")).toBe("hello #tom#");
    expect(t("hello {|bookname('#','!')}", "tom")).toBe("hello #tom!");
    expect(t("hello {|bookname|bookname|bookname}", "tom")).toBe(
      "hello 《《《tom》》》"
    );
    await scope.change("en");
    expect(t("hello {|bookname}", "tom")).toBe("hello <tom>");
  });
});
