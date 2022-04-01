<script setup>
import { ref } from 'vue'

defineProps({
    title: String
})

const count = ref(0)

</script>

<template>
    <div style="padding:16px;border:1px red solid;margin:0 auto;margin-bottom:16px;width:600px;">
        <h2>{{ title }}</h2>  
        <h3>{{ t("成立于{}年",1949)}} </h3>
        <h3>{{ t("首都：北京")}} </h3>
    </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
