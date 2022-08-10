<script setup>
defineProps({
    title: String
})



</script>
<script>
import China from './china.vue'
export default {
    components: { China },
    data() {
        return {
            NOW: null//new Date()

        }
    }
}
</script>
<template>
    <div style="padding:16px;border:1px red solid;line-height:120%;margin:0 auto;margin-bottom:16px;width:600px;text-align:left;">
        <table>
            <thead>
                <tr style="font-weight:bold;">
                    <td style="width:200px;">格式化器</td>
                    <td>内容</td>
                </tr>
            </thead>
            <tbody>
                <tr><td colspan="2" ><b>日期</b></td></tr>
                <tr><td>默认</td><td>{{ t("现在是{ value  }", NOW) }}</td></tr>
                <tr><td>date</td><td>{{ t("现在是{ value | date }", NOW) }}</td></tr>
                <tr><td>shortdate</td><td>{{ t("现在是{ value | shortdate }", NOW) }}</td></tr>
                <tr><td>time</td><td>{{ t("现在是{ value | time }", NOW) }}</td></tr>
                <tr><td>shorttime</td><td>{{ t("现在是{ value | shorttime }", NOW) }}</td></tr>
                <tr><td>year</td><td>{{ t("现在是{ value | year }", NOW) }}</td></tr>
                <tr><td>month</td><td>{{ t("现在是{ value | month }", NOW) }}</td></tr>
                <tr><td>day</td><td>{{ t("现在是{ value | day }", NOW) }}</td></tr>
                <tr><td>weekdayValue</td><td>{{ t("现在是{ value | weekdayValue }", NOW) }}</td></tr>
                <tr><td>weekday</td><td>{{ t("现在是{ value | weekday }", NOW) }}</td></tr>
                <tr><td>shortWeekday</td><td>{{ t("现在是{ value | shortWeekday }", NOW) }}</td></tr>
                <tr><td>monthName</td><td>{{ t("现在是{ value | monthName }", NOW) }}</td></tr>
                <tr><td>shorMonthName</td><td>{{ t("现在是{ value | shorMonthName }", NOW) }}</td></tr>
                <tr><td colspan="2" ><b>时间</b></td></tr>
                <tr><td>hour</td><td>{{ t("现在是{ value | hour }", NOW) }}</td></tr>
                <tr><td>hour12</td><td>{{ t("现在是{ value | hour12 }", NOW) }}</td></tr>
                <tr><td>minute</td><td>{{ t("现在是{ value | minute }", NOW) }}</td></tr>
                <tr><td>second</td><td>{{ t("现在是{ value | second }", NOW) }}</td></tr>
                <tr><td>millisecond</td><td>{{ t("现在是{ value | millisecond }", NOW) }}</td></tr>
                <tr><td>timestamp</td><td>{{ t("现在是{ value | timestamp }", NOW) }}</td></tr>
                <tr><td colspan="2" ><b>货币</b></td></tr>
                <tr><td>currency-cny</td><td>{{ t("商品价格：{ value | currency('CNY','元整',3)}", 788741) }}</td></tr>
                <tr><td>currency</td><td>{{ t("商品价格：{ value | currency }", 788741) }}</td></tr>
                <tr><td>capitalizeCurrency</td><td>{{ t("商品价格：{ value | capitalizeCurrency }", 788741) }}</td></tr>
                <tr><td>capitalizeCurrency</td><td>{{ t("商品价格：{ value | capitalizeCurrency(true) }", 788741.35) }}</td></tr>
                <tr><td colspan="2" ><b>数字</b></td></tr>
                <tr><td>number</td><td>{{ t("商品数量：{ value | number }", 1875109.987) }}</td></tr>

            </tbody>
        </table>
    </div>
</template>

<style scoped>
a {
    color: #42b983;
}
</style>
