<script setup lang="ts">
import { ref } from 'vue'

defineProps({
    title: String
})

const count = ref(0)

</script>
<script lang="ts">
export default {

}
</script>

<template>
    <div>
        <h2>{{ title }}</h2>  
        <h3>{{ t("成立于{}年",1949)}} </h3>
        <h3>{{ t("首都：北京")}} </h3>
        <h3>{{ t("首都：{city}",{city:"北京"})}} </h3>
        <h3>{{ t("{count}人在等你聊天哦",{count:100}) }} </h3>
    </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
