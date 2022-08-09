<script setup> 
    defineProps({
        title: String
    })



</script>
<script>
import China from './china.vue'
export default {
    components:{China},
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
        <p>{{ t("现在是{ value | date }",date1)}} </p>
        <p>{{ t("现在是{ value | date }",date2)}} </p>
        <p>{{ t("现在是{ value | date }",date3)}} </p>
        <China></China>
    </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
