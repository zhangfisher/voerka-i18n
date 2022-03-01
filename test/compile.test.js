const { getInterpolatedVars,  replaceInterpolateVars}  = require('../src/index.js')

 
test("获取表达式中的插值变量",done=>{
    const results = getInterpolatedVars("中华人民共和国成立于{date | year | time }年,首都是{city}市");
    expect(results.map(r=>r[0]).join(",")).toBe("date,city");
    expect(results[0][0]).toEqual("date");
    expect(results[0][1]).toEqual(["year","time"]);
    expect(results[1][0]).toEqual("city");
    expect(results[1][1]).toEqual([]);
    done()
})
test("表达式中定义了重复的插值变量",done=>{
    const results = getInterpolatedVars("{a}{a}{a|x}{a|x}{a|x|y}{a|x|y}");
    expect(results.length).toEqual(3);
    expect(results[0][0]).toEqual("a");
    expect(results[0][1]).toEqual([]);
    expect(results[1][0]).toEqual("a");
    expect(results[1][1]).toEqual(["x"]);
    expect(results[2][0]).toEqual("a");
    expect(results[2][1]).toEqual(["x","y"]);
    done()
})
// test("替代表达式中的插值变量",done=>{
//     const results = replaceInterpolateVars("中华人民共和国成立于{date}年,首都是{city}市",{
//         date:1949,
//         city:"北京"
//     });
//     expect(results).toBe("中华人民共和国成立于1949年,首都是北京市");
//     done()
// }