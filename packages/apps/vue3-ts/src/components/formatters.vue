<script setup lang="ts">
defineProps({
    title: String
})



</script>
<script lang="ts">
import China from './china.vue'
export default {
    components: { China },
    data() {
        return {
            NOW: new Date(),
            datetime:null

        }
    }
}
</script>
<template>
    <div class="font-size:6px;">
        {{t("Hello world!")}}
        <table>
            <thead>
                <tr style="font-weight:bold;">
                    <td style="width:200px;">格式化器</td>
                    <td>内容</td>
                </tr>
            </thead>
            <tbody>
                <tr><td colspan="2" >
                    <select v-model="datetime" >
                        <option default :value="null">空值</option>
                        <option :value="NOW">现在</option>
                    </select>    
                </td></tr>
                <tr><td colspan="2" ><b>日期</b></td></tr>
                <tr><td colspan="2">
                    {{t("现在是{ value | date }",new Date()) }}<br>
                    {{t("现在是{ value | date }","2022/12/9 09:12:36")      }}<br>
                    {{t("现在是{ value | date }",1661084229790)}}<br>
                    {{t("现在是{ value | date('long') }",new Date())}}<br>
                    {{t("现在是{ value | date('short') }","2022/12/9 09:12:36")      }}<br>
                    {{t("现在是{ value | date('local') }",1661084229790)}}<br>
                    {{t("现在是{ value | date('iso') }",1661084229790)}}<br>
                    {{t("现在是{ value | date('gmt') }",1661084229790)}}<br>
                    {{t("现在是{ value | date('utc') }",1661084229790)}}<br>
                    {{t("现在是{ value | date('YYYY年MM月DD日 HH点mm分ss秒') }",1661084229790)}}<br>
                    {{t("现在是{ value | date('YYYY-MM-DD') }",1661084229790)}}
                </td></tr>
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
