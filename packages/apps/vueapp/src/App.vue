<script setup>
import { reactive } from 'vue'

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import China from './components/china.vue'
import Formatters from './components/formatters.vue'

let messages = reactive({
    name: t('VoerkaI18n多语言解决方案 ')
})

console.log("App=", messages.name)

setTimeout(() => {
    messages.name = 'Vue App 2'
}, 5000)

// console.log(t("Hello world!"))
</script>  
<script>
import { reactive } from 'vue'
export default {
    inject: ['i18n'],
    data() {
        return {
            language: this.i18n.activeLanguage,
            tabIndex:0
        }
    },
    watch: {

    },
    methods: {
        async changeLanguage(value) {
            this.i18n.activeLanguage = value
            //this.activeLanguage = value
            // await this.i18n.change(this.language)
        }
    }
}
</script>  
<template>
    <div>
        <h1 class="navbar" id="title">
            VoerkaI18n多语言解决方案
            <div class="menu" >
                <button class="menuitem" :key="lng.name" v-for="lng of i18n.languages" @click="i18n.activeLanguage = lng.name"
                :style="{ 'outline': lng.name === i18n.activeLanguage.value ? '2px red solid' : '' }">{{ lng.title
                }}</button>
            <button class="menuitem"  @click="i18n.activeLanguage = 'de'"
                :style="{ 'outline': i18n.activeLanguage.value === 'de' ? '2px red solid' : '' }">德语</button>
            <button class="menuitem"  @click="i18n.activeLanguage = 'jp'"
                :style="{ 'outline': i18n.activeLanguage.value === 'jp' ? '2px red solid' : '' }">日语</button>
            </div>
        </h1>
        <span><b>默认语言：</b>{{ i18n.defaultLanguage }}&nbsp;&nbsp;&nbsp;&nbsp;<b>当前语言：</b>{{ i18n.activeLanguage.value }}</span>       
        <div class="tabs">
            <div class="tab" title="" >
                <h3>{{ t("中华人民共和国") }} </h3>
                <h3>{{ t("迎接中华民族的伟大复兴") }} </h3>
                <China :title="t('中华人民共和国')" />
            </div>
            <div class="tab" style="flex:2;font-size:small">
                <Formatters />
            </div> 
        </div>
        
    
         
    </div>
</template>


<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50; 
    margin-top:80px;
}
.navbar{
    position: fixed;
    margin:0;
    top:0;
    left:0;
    width: 100%;
    height: 48px;
    background: #298df1;
    padding: 12px;
    color:white;
    text-align: left ;
}
.navbar>.menu{
    float:right;
    top:0;
    margin:0px;
    padding-right:20px;
}

.navbar>.menu>.menuitem{
    padding:8px;
    margin:8px;
    cursor:pointer;
}
.tabs{
    width:100%;
    padding: 8px;
    position: relative;
    display: flex;
    align-items: flex-start;
    flex-direction: row;

}
.tabs > .tab{
    position: relative;
    padding: 8px;
    background: #f3f3f3;
    min-height: 500px;
    margin:4px;
    color:rgb(4, 123, 202);
    flex:1;
    border-radius: 8px;
}
</style>
