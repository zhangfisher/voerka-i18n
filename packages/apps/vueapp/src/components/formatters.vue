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
            date1: new Date(),
            date2: "2022/12/3 19:08:12",
            date3: 1659872118897,

        }
    }
}
</script>
<template>
    <div style="padding:16px;border:1px red solid;line-height:120%;margin:0 auto;margin-bottom:16px;width:600px;">
        <p>{{ t("现在是{ value | date }", date1) }} </p>
        <p>{{ t("现在是{ value | shortdate }", date2) }} </p>
        <p>{{ t("现在是{ value | time }", date3) }} </p>
        <p>{{ t("现在是{ value | shorttime }", date3) }} </p>
        <p>{{ t("现在是{ value | year }", date3) }} </p>
        <p>{{ t("现在是{ value | month }", date3) }} </p>
        <p>{{ t("现在是{ value | day }", date3) }} </p>
        <p>{{ t("现在是{ value | weekdayValue }", date3) }} </p>
        <p>{{ t("现在是{ value | weekday }", date3) }} </p>
        <p>{{ t("现在是{ value | shortWeekday }", date3) }} </p>
        <p>{{ t("现在是{ value | monthName }", date3) }} </p>
        <p>{{ t("现在是{ value | shorMonthName }", date3) }} </p>
        <p>{{ t("现在是{ value | hour }", date3) }} </p>
        <p>{{ t("现在是{ value | hour12 }", date3) }} </p>
        <p>{{ t("现在是{ value | minute }", date3) }} </p>
        <p>{{ t("现在是{ value | second }", date3) }} </p>
        <p>{{ t("现在是{ value | millisecond }", date3) }} </p>
        <p>{{ t("现在是{ value | timestamp }", date3) }} </p>
        <p>{{ t("商品价格：{ value | currency }", 854) }} </p>
        <p>{{ t("商品价格：{ value | currency("==","元整",3) }", 854) }} </p>
        <p>{{ t("商品价格：{ value | currency }", 874312.33) }} </p>
        <p>{{ t("商品价格：{ value | capitalizeCurrency }", 874312.33) }} </p>
    </div>
</template>

<style scoped>
a {
    color: #42b983;
}
</style>
