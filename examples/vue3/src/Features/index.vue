<template>
    <div class="container mx-auto mt-18 pt-8 px-8 min-h-lvh">
        <div class="md:flex">
            <ul class="flex-column w-50 p-0 min-h-300 text-sm font-medium text-gray-500 md:me-4 mb-4 md:mb-0 border-1 rounded border-gray-200 ">
                    <li key={index} 
                        v-for="(feature,index) in features"
                        class="cursor-pointer text-center py-4 hover:bg-blue-700 ext-gray-900  hover:text-white"
                        :class="index==active ? 'text-indigo-600': ''"                                        
                        @click="active=index"
                    > 
                            <Translate :message="()=>feature.title"/> 
                    </li>
            </ul>
            <div class="p-6 bg-gray-50 text-medium text-gray-500 w-full">
                <div key={index} v-for="(feature,index) in features" 
                    :style="{display: index===active ? 'block':'none'}"
                >
                    <Component :is="feature.component"/>
                </div>
            </div>
        </div>
    </div> 
</template>
<script setup>
import { ref } from 'vue'
import Trans from "./Trans"
import Patch from './Patch'
import { t,Translate } from "../languages"

const active = ref(0)
const features = [
    { title:t("翻译组件"), component: Trans },
    { title:t("语言补丁"), component: Patch }
]

</script>