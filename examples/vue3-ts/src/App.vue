<script setup lang="ts">
import { injectVoerkaI18n } from "@voerkai18n/vue"
import { t } from "./languages"
import China from './components/china.vue'
import Formatters from './components/formatters.vue'
 
console.log(t("Hello world!"))

const i18n = injectVoerkaI18n()

</script>
<script lang="ts">

export default {
    data() {
        console.log(t("data： Hello world!"))
        return {
            tabIndex: 0,
            a: this.a
        }
    },
    watch: {

    },
    methods: {
        async changeLanguage(this: any, value: string) {

            this.i18n.activeLanguage = value
            console.log("change language =", this.i18n.activeLanguage, value)
            //this.activeLanguage = value
            // await this.i18n.change(this.language)
        }
    }
}

</script>  
 

<template>
    <div>
        <h1 class="navbar">
            <div class="title">VoerkaI18n多语言解决方案 - {{ $activeLanguage }}</div>
            <div class="menu">
                <button class="menuitem" :key="lng.name" v-for="lng of i18n.languages"
                    @click="i18n.activeLanguage = lng.name"
                    :style="{ 'outline': lng.name === i18n.activeLanguage ? '2px red solid' : '' }">{{ lng.title }}</button>
                <!-- <button class="menuitem" @click="i18n.activeLanguage = 'de'"
                    :style="{ 'outline': i18n.activeLanguage === 'de' ? '2px red solid' : '' }">德语</button>
                <button class="menuitem" @click="i18n.activeLanguage = 'jp'"
                    :style="{ 'outline': i18n.activeLanguage === 'jp' ? '2px red solid' : '' }">日语</button> -->
            </div>
        </h1>    
        <div class="content">
            <span><b>默认语言：</b>{{ i18n.defaultLanguage }}&nbsp;&nbsp;&nbsp;&nbsp;<b>当前语言：</b>{{ i18n.activeLanguage }}</span>
            <div class="tabs">
                <div class="tab">
                    <button class="menuitem" @click="$activeLanguage = 'en'"
                    :style="{ 'outline': i18n.activeLanguage === 'jp' ? '2px red solid' : '' }">英语</button> 
                    <h3>1.{{ t("Hello world!") }}</h3>
                    <h3>2.{{ t("中华人民共和国") }} </h3>
                    <h3>3.{{ t("迎接中华民族的伟大复兴") }} </h3>
                    <China :title="t('中华人民共和国')" />
                </div>
                <div class="tab" style="flex:2;font-size:small">
                    <Formatters />
                </div>
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
    font-size: 10px;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

#app>div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

#app>div>.content {
    flex-grow: 1;
}

.navbar {
    margin: 0;
    box-sizing: content-box;
    width: 100%;
    height: 48px;
    background: hwb(210 2% 38%);
    display: flex;
    flex-direction: row;
    padding: 12px;
    color: white;
    text-align: left;
    align-items: center;
    padding-right: 24px;
}

.navbar>.title {
    flex-grow: 1;
}

.navbar>.menu {
    flex-grow: 1;
    top: 0;
    margin: 0px;
    padding-right: 20px;
    display: flex;
    align-items: left;
    justify-content: center;
    flex-direction: row;
}

.navbar>.menu>.menuitem {

    padding: 8px;
    margin: 8px;
    font-size: 14px;
    cursor: pointer;
}

.tabs {
    width: 100%;
    padding: 8px;
    position: relative;
    display: flex;
    align-items: flex-start;
    flex-direction: row;

}

.tabs>.tab {
    position: relative;
    padding: 8px;
    background: #f3f3f3;
    min-height: 500px;
    margin: 4px;
    color: rgb(4, 123, 202);
    flex: 1;
    border-radius: 8px;
}</style>
