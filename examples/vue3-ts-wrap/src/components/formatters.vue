<script setup lang="ts">


</script>
<script lang="ts">
import { t } from "../languages";
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
        <table>
            <thead>
                <tr style="font-weight:bold;">
                    <td style="width:200px;">{{t('格式化器')}}</td>
                    <td>{{t('内容')}}</td>
                </tr>
            </thead>
            <tbody>
                <tr><td colspan="2" >
                    <select v-model="datetime" >
                        <option default :value="null">{{t('空值')}}</option>
                        <option :value="NOW">{{t('现在')}}</option>
                    </select>    
                </td></tr>
                <tr><td colspan="2" ><b>{{t('日期')}}</b></td></tr>
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
                <tr><td colspan="2" ><b>{{t('货币')}}</b></td></tr>
                <tr><td colspan="2" >
            <p>{{t("{ value | currency({symbol:'￥￥'})}",123456789.88)}}</p>
            <p>{{t("{ value | currency({symbol:'￥￥',prefix:'人民币:'})}",123456789.88)}}</p>
            <p>{{t("{ value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整'})}",123456789.88)}}</p>
            <p>{{t("{ value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2})}",123456789.88)}}</p>
            <p>{{t("{ value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2,precision:4})}",123456789.88)}}</p>
            </td></tr>
                <tr><td colspan="2" ><b>{{t('数字')}}</b></td></tr>
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
