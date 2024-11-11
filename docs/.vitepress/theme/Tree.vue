<template>
    <LiteTree :getIcon="getFileTypeIcon" :data="data"> 
    </LiteTree>
</template>
<script setup>
import { useSlots } from 'vue';
import { LiteTree } from '@lite-tree/vue';
import { getFileTypeIcon } from "@lite-tree/icons"

const slots = useSlots();
const data = slots.default?.()[0].children;

</script>