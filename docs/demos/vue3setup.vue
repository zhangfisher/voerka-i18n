<template>
    <div>
      <div title="你好">你好 {{ title }} </div> 
    </div>
</template>
<script setup>
const title = "你好"
  // import { ref, onMounted, onUnmounted } from 'vue';
  // import { t, i18nScope } from '../languages';
  
  // const title = ref(t('你好'))  // [!code ++]
  
  // let subscriber
  
  // onMounted(()=>{
  //   subscriber = i18nScope.on('change',()=>{
  //     title.value = t('你好')
  //   })
  // })
  
  // onUnmounted(()=>{
  //   subscriber.off()
  // })
  
</script>  