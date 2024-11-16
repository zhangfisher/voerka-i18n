<template>
  <div>
    <div>{{t('中文')}}</div>
  </div>
</template>

<script lang='ts' setup>
import { t } from "../languages";
import { reactive, onMounted, computed, ref, watch } from 'vue';
const text = t('中文')

</script>
<style scoped>

</style>
