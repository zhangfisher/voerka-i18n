<template>
    <div class="container mx-auto  pt-4 px-8 min-h-lvh">
        <h1>MIT许可证</h1>
<Translate id="license" tag="div" style="border:1px solid red;" >
版权所有 (c) [年份] [版权持有者]
特此免费授予任何获得本软件及相关文档文件（以下简称“软件”）副本的人，不受限制地处理本软件的权限，包括但不限于使用、复制、修改、合并、发布、分发、再许可和/或出售本软件的副本，并允许获得本软件的人这样做，但须满足以下条件：
上述版权声明和本许可声明应包含在本软件的所有副本或重要部分中。
本软件“按原样”提供，不提供任何形式的明示或暗示的担保，包括但不限于对适销性、特定用途适用性和非侵权性的担保。在任何情况下，作者或版权持有者均不对任何索赔、损害或其他责任负责，无论是在合同、侵权或其他行为中产生的，还是与本软件或本软件的使用或其他交易有关的。
</Translate>
    <div :title="t('你好')">{{ title }}</div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { $t } from '../languages'; 
 
const title = $t('你好') 

</script>
  