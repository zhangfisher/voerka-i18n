<template>
    <pre><code class="hljs" v-html="highlightedCode"></code></pre>
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
        theme: 'vitesse-dark'
    }).then((html) => {
        highlightedCode.value = html;
    })
</script>
    