/**
 * 内置格式化器的测试
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
import { VoerkaI18nScope, VoerkaI18nTranslate } from '@voerkai18n/runtime'
import { createVoerkaI18nScope } from "./_utils";

let scope: VoerkaI18nScope;
let t: VoerkaI18nTranslate;

describe("格式化器", () => {
    beforeAll(async () => {
        scope = createVoerkaI18nScope();
        t = scope.t
    });
    beforeEach(async () => {
        await scope.change("zh-CN")
    })        
    test("number", async () => {
        // 默认保留原始精度
        expect(t("number:{|number}", 123456789)).toBe("number:1,2345,6789");
        expect(t("number:{|number}", 123456789.12345678)).toBe("number:1,2345,6789.12345678");
        // number(<小数精度>,<分割位数>)
        expect(t("number:{|number(0)}", 123456789.12345678)).toBe("number:1,2345,6789");
        expect(t("number:{|number(1)}", 123456789.12345678)).toBe("number:1,2345,6789.1");
        expect(t("number:{|number(2)}", 123456789.12345678)).toBe("number:1,2345,6789.12");
        expect(t("number:{|number(3)}", 123456789.12345678)).toBe("number:1,2345,6789.123");
        expect(t("number:{|number(4)}", 123456789.12345678)).toBe("number:1,2345,6789.1235");    // 四舍五入
        
        // 自定义分割位
        expect(t("number:{|number(0,3)}", 123456789.12345678)).toBe("number:123,456,789");
        expect(t("number:{|number(1,3)}", 123456789.12345678)).toBe("number:123,456,789.1");
        expect(t("number:{|number(2,3)}", 123456789.12345678)).toBe("number:123,456,789.12");
        expect(t("number:{|number(3,3)}", 123456789.12345678)).toBe("number:123,456,789.123");
        expect(t("number:{|number(4,3)}", 123456789.12345678)).toBe("number:123,456,789.1235");    // 四舍五入
        

        await scope.change("en-US");

        expect(t("number:{|number}", 123456789)).toBe("number:123,456,789");
        expect(t("number:{|number}", 123456789.12345678)).toBe("number:123,456,789.12345678");
        // number(<小数精度>,<分割位数>)
        expect(t("number:{|number(0)}", 123456789.12345678)).toBe("number:123,456,789");
        expect(t("number:{|number(1)}", 123456789.12345678)).toBe("number:123,456,789.1");
        expect(t("number:{|number(2)}", 123456789.12345678)).toBe("number:123,456,789.12");
        expect(t("number:{|number(3)}", 123456789.12345678)).toBe("number:123,456,789.123");
        expect(t("number:{|number(4)}", 123456789.12345678)).toBe("number:123,456,789.1235");    // 四舍五入    
        // 自定义分割位
        expect(t("number:{|number(0,4)}", 123456789.12345678)).toBe("number:1,2345,6789");
        expect(t("number:{|number(1,4)}", 123456789.12345678)).toBe("number:1,2345,6789.1");
        expect(t("number:{|number(2,4)}", 123456789.12345678)).toBe("number:1,2345,6789.12");
        expect(t("number:{|number(3,4)}", 123456789.12345678)).toBe("number:1,2345,6789.123");
        expect(t("number:{|number(4,4)}", 123456789.12345678)).toBe("number:1,2345,6789.1235");    // 四舍五入

    });
    test("currency", async () => {
        expect(t("{|currency}", 123456789.123456)).toBe("￥1,2345,6789.12");
        expect(t("{|currency('default)}", 123456789.123456)).toBe("￥1,2345,6789.12");
        expect(t("{|currency('short)}", 123456789.123456)).toBe("￥1,2345,6789.12");
        expect(t("{|currency('long')}", 123456789.123456)).toBe("RMB ￥1,2345,6789.12元");
        expect(t("{|currency('custom)}", 123456789.123456)).toBe("RMB ￥1,2345,6789.12元");
        expect(t("{ value | currency}", 123456789.88)).toBe("￥1,2345,6789.88")
        // long
        expect(t("{ value | currency('long')}", 123456789.88)).toBe("RMB ￥1,2345,6789.88元")
        expect(t("{ value | currency('long',1)}", 123456789.88)).toBe("RMB ￥1,2345.678988万元")
        expect(t("{ value | currency('long',2)}", 123456789.88)).toBe("RMB ￥1.2345678988亿元")
        expect(t("{ value | currency('long',3)}", 123456789.88)).toBe("RMB ￥0.00012345678988万亿元")
        expect(t("{ value | currency('long',4)}", 123456789.88)).toBe("RMB ￥0.000000012345678988万万亿元")
        // short
        expect(t("{ value | currency('short')}", 123456789.88)).toBe("￥1,2345,6789.88")
        expect(t("{ value | currency('short',1)}", 123456789.88)).toBe("￥1,2345.678988万")
        expect(t("{ value | currency('short',2)}", 123456789.88)).toBe("￥1.2345678988亿")
        expect(t("{ value | currency('short',3)}", 123456789.88)).toBe("￥0.00012345678988万亿")
        expect(t("{ value | currency('short',4)}", 123456789.88)).toBe("￥0.000000012345678988万万亿")
        
        expect(t("{ value | currency({format:'long',symbol:'￥￥'})}", 123456789.88)).toBe("RMB ￥￥1,2345,6789.88元")
        expect(t("{ value | currency({format:'long',symbol:'￥￥',prefix:'人民币:'})}", 123456789.88)).toBe("人民币: ￥￥1,2345,6789.88元")
        expect(t("{ value | currency({format:'long',symbol:'￥￥',prefix:'人民币:',suffix:'元整'})}", 123456789.88)).toBe("人民币: ￥￥1,2345,6789.88元整")
        expect(t("{ value | currency({format:'long',symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2})}", 123456789.88)).toBe("人民币: ￥￥1.2345678988亿元整")
        expect(t("{ value | currency({format:'long',symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2,precision:4})}", 123456789.88)).toBe("人民币: ￥￥1.2346亿元整")
        expect(t("{ value | currency({format:'long',symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2,precision:4,format:'{prefix}*{symbol}*{value}*{unit}*{suffix}'})}", 123456789.88)).toBe("人民币:*￥￥*1.2346*亿*元整")
        
        await scope.change("en-US");

        expect(t("{|currency}", 123456789.456)).toBe("$123,456,789.46");
        expect(t("{|currency('default)}", 123456789.456)).toBe("$123,456,789.46");
        expect(t("{|currency('short)}", 123456789.456)).toBe("$123,456,789.46");
        expect(t("{|currency('long')}", 123456789.456)).toBe("USD $123,456,789.46");
        expect(t("{|currency('custom')}", 123456789.456)).toBe("USD $123,456,789.46");
        expect(t("{ value | currency}", 123456789.88)).toBe("$123,456,789.88")
        // long
        expect(t("{ value | currency('long')}", 123456789.88)).toBe("USD $123,456,789.88")
        expect(t("{ value | currency('long',1)}", 123456789.88)).toBe("USD $123,456.78988 thousands")
        expect(t("{ value | currency('long',2)}", 123456789.88)).toBe("USD $123.45678988 millions")
        expect(t("{ value | currency('long',3)}", 123456789.88)).toBe("USD $0.12345678988 billions")
        expect(t("{ value | currency('long',4)}", 123456789.88)).toBe("USD $0.00012345678988 trillions")
        // short
        expect(t("{ value | currency('short')}", 123456789.88)).toBe("$123,456,789.88")
        expect(t("{ value | currency('short',1)}", 123456789.88)).toBe("$123,456.78988 thousands")
        expect(t("{ value | currency('short',2)}", 123456789.88)).toBe("$123.45678988 millions")
        expect(t("{ value | currency('short',3)}", 123456789.88)).toBe("$0.12345678988 billions")
        expect(t("{ value | currency('short',4)}", 123456789.88)).toBe("$0.00012345678988 trillions")
    });
    test("date", async () => {
        let now = new Date("2022/12/9 09:12:36")
        expect(t("{ value | date }", now)).toBe("2022/12/9 09:12:36")                      // Date类型
        expect(t("{ value | date('local') }", now)).toBe("2022/12/9 09:12:36")
        expect(t("{ value | date('iso') }", now)).toBe("2022-12-09T01:12:36.000Z")
        expect(t("{ value | date('utc') }", now)).toBe("Fri, 09 Dec 2022 01:12:36 GMT")
        expect(t("{ value | date('gmt') }", now)).toBe("Fri, 09 Dec 2022 01:12:36 GMT")
        expect(t("{ value | date('short') }", now)).toBe("2022年12月9日")
        expect(t("{ value | date('long') }", now)).toBe("2022年12月9日 09点12分36秒")
        await scope.change("en-US");
        expect(t("{ value | date('short') }", now)).toBe("2022/12/09")
        expect(t("{ value | date('long') }", now)).toBe("2022/12/09 09:12:36")

    });
    test("time", async () => {
        let now = new Date("2022/12/9 09:12:36")
        expect(t("{ value | time }", now)).toBe("09:12:36")
        expect(t("{ value | time('local') }", now)).toBe("09:12:36")
        expect(t("{ value | time('short') }", now)).toBe("09:12:36")
        expect(t("{ value | time('long') }", now)).toBe("09点12分36秒")
        await scope.change("en-US");
        expect(t("{ value | time('short') }", now)).toBe("09:12:36")
        expect(t("{ value | time('long') }", now)).toBe("09:12:36")
    });
    test("quarter", async () => {
        let now = new Date("2022/12/9 09:12:36")
        expect(t("{ value | quarter }", now)).toBe("Q4")
        expect(t("{ value | quarter('long') }", now)).toBe("四季度")
        expect(t("{ value | quarter('short') }", now)).toBe("Q4")
        await scope.change("en-US");
        expect(t("{ value | quarter }", now)).toBe("Q4")
        expect(t("{ value | quarter('long') }", now)).toBe("Fourth Quarter")
        expect(t("{ value | quarter('short') }", now)).toBe("Q4")
    });
    test("month", async () => {
        let now = new Date("2022/12/9 09:12:36")
        expect(t("{ value | month }", now)).toBe("十二月")
        expect(t("{ value | month('number') }", now)).toBe("12")
        expect(t("{ value | month('long') }", now)).toBe("十二月")
        expect(t("{ value | month('short') }", now)).toBe("12月")
        await scope.change("en-US");
        expect(t("{ value | month }", now)).toBe("December")
        expect(t("{ value | month('number') }", now)).toBe("12")
        expect(t("{ value | month('long') }", now)).toBe("December")
        expect(t("{ value | month('short') }", now)).toBe("Dec")
    });
    test("weekday", async () => {
        let now = new Date("2022/12/9 09:12:36")
        expect(t("{ value | weekday }", now)).toBe("星期五")
        expect(t("{ value | weekday('number') }", now)).toBe("5")
        expect(t("{ value | weekday('long') }", now)).toBe("星期五")
        expect(t("{ value | weekday('short') }", now)).toBe("周五")
        await scope.change("en-US");
        expect(t("{ value | weekday }", now)).toBe("Friday")
        expect(t("{ value | weekday('number') }", now)).toBe("5")
        expect(t("{ value | weekday('long') }", now)).toBe("Friday")
        expect(t("{ value | weekday('short') }", now)).toBe("Fri")
    });
    
    test("timeSlots", async () => {
        // slots: [5, 8, 11, 13, 18],
        // lowerCases: ["凌晨", "早上", "上午", "中午", "下午", "晚上"],
        // upperCases: ["凌晨", "早上", "上午", "中午", "下午", "晚上"]
        let now = new Date("2022/12/9 09:12:36")
        expect(t("{ value | timeSlots }", new Date("2022/12/9 02:12:36"))).toBe("凌晨") 
        expect(t("{ value | timeSlots }", new Date("2022/12/9 07:12:36"))).toBe("早上")
        expect(t("{ value | timeSlots }", new Date("2022/12/9 10:12:36"))).toBe("上午")
        expect(t("{ value | timeSlots }", new Date("2022/12/9 12:12:36"))).toBe("中午")
        expect(t("{ value | timeSlots }", new Date("2022/12/9 15:12:36"))).toBe("下午")
        expect(t("{ value | timeSlots }", new Date("2022/12/9 20:12:36"))).toBe("晚上")
        await scope.change("en-US"); 
        // slots: [12],
        // lowerCases: ["am", "pm"],
        // upperCases: ["AM", "PM"]
        expect(t("{ value | timeSlots }", new Date("2022/12/9 02:12:36"))).toBe("AM") 
        expect(t("{ value | timeSlots }", new Date("2022/12/9 07:12:36"))).toBe("AM")
        expect(t("{ value | timeSlots }", new Date("2022/12/9 10:12:36"))).toBe("AM")
        expect(t("{ value | timeSlots }", new Date("2022/12/9 12:12:36"))).toBe("PM")
        expect(t("{ value | timeSlots }", new Date("2022/12/9 15:12:36"))).toBe("PM")
        expect(t("{ value | timeSlots }", new Date("2022/12/9 20:12:36"))).toBe("PM")

        expect(t("{ value | timeSlots(false) }", new Date("2022/12/9 02:12:36"))).toBe("am") 
        expect(t("{ value | timeSlots(false) }", new Date("2022/12/9 07:12:36"))).toBe("am")
        expect(t("{ value | timeSlots(false) }", new Date("2022/12/9 10:12:36"))).toBe("am")
        expect(t("{ value | timeSlots(false) }", new Date("2022/12/9 12:12:36"))).toBe("pm")
        expect(t("{ value | timeSlots(false) }", new Date("2022/12/9 15:12:36"))).toBe("pm")
        expect(t("{ value | timeSlots(false) }", new Date("2022/12/9 20:12:36"))).toBe("pm")
        
    });
    test("relativeTime", async () => {
        let now = Date.now()
        expect(t(`{ value | relativeTime(${now}) }`, now)).toBe("刚刚")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000)).toBe("1秒前")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60)).toBe("1分钟前")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60 * 60)).toBe("1小时前")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60 * 60 * 24)).toBe("1天前")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60 * 60 * 24 * 30)).toBe("1个月前")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60 * 60 * 24 * 365)).toBe("1年前")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000)).toBe("1秒后")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60)).toBe("1分钟后")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60 * 60)).toBe("1小时后")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60 * 60 * 24)).toBe("1天后")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60 * 60 * 24 * 30)).toBe("1个月后")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60 * 60 * 24 * 365)).toBe("1年后")
        await scope.change("en-US");
        expect(t(`{ value | relativeTime(${now}) }`, now)).toBe("Just now")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000)).toBe("1 seconds ago")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60)).toBe("1 minutes ago")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60 * 60)).toBe("1 hours ago")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60 * 60 * 24)).toBe("1 days ago")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60 * 60 * 24 * 30)).toBe("1 months ago")
        expect(t(`{ value | relativeTime(${now}) }`, now - 1000 * 60 * 60 * 24 * 365)).toBe("1 years ago")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000)).toBe("after 1 seconds")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60)).toBe("after 1 minutes")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60 * 60)).toBe("after 1 hours")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60 * 60 * 24)).toBe("after 1 days")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60 * 60 * 24 * 30)).toBe("after 1 months")
        expect(t(`{ value | relativeTime(${now}) }`, now + 1000 * 60 * 60 * 24 * 365)).toBe("after 1 years")

    }); 
});
