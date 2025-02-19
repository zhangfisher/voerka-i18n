<template>
    <div class="hljs" v-html="highlightedCode"></div>
</template>
   
<script setup lang="ts">
import { ref } from 'vue';
import { codeToHtml } from "shiki";
   
    const props = defineProps({
        code: {
        type: String,
        required: true
        } 
    });
    
    const highlightedCode = ref(props.code);

    codeToHtml(props.code, {
        lang: 'ts',
        theme: 'ayu-dark'
    }).then((html) => {
        highlightedCode.value = html;
    })
</script>
<style > 
.hljs > pre{
    padding: 4px;
    border-radius: 8px!important;
    padding-bottom: 16px;
}
</style>