<script setup>
import {ref} from 'vue'
import {t,i18nScope} from '@t'
import {injectVoerkaI18n} from "@voerkai18n/vue";
const arr = [0,1,2,5,8,7,6,3,0]
const i18n = injectVoerkaI18n()
const circle = ref(10)
console.log(i18n)
const _value = ref(null)
const _val = ref(null)

const tabIndex = ref(null)

const timeOut = ref(null)
let currentSum = 0
function randomNum(val){
  const num = Math.floor(Math.random() * 9)
  return num===val? randomNum(...arguments): num
}
function run(){
  if(!_value.value){
    _value.value=arr?.[randomNum(4)]
    _val.value = null
    console.log(`---------- ${t('抽奖')} -----------`)
  }
  let tab = 0
  stop()
  timeOut.value = setInterval(()=>{
    if(_value.value&&_value.value === tabIndex.value && currentSum >= circle.value){
      stop()
      currentSum = 0
      _val.value = _value.value
      console.log(`----------${t('抽奖完毕')}------------`)
      console.log(`${t('中奖 _value')}`,_value.value)
      console.log(`${t('中奖 _val')}`,_val.value)
      tabIndex.value = null
      _value.value=null
      return
    }
    tab++


    tabIndex.value = arr[tab]
    if(tab === arr?.length-1){
      console.log(`----------${t(`第{i}圈`,{i:currentSum+1})}------------`)
      currentSum++
      run()
    }
  },100 - (currentSum>=5?(circle.value - currentSum):currentSum)*20)

}
function onSelect(e){
  const item = JSON.parse(e.target?.selectedOptions?.[0]?.dataset?.item) || i18n.languages?.[0]
  console.dir(e.target.selectedOptions?.[0].dataset.item)
  console.log(e.target.selectedIndex)
  console.log(JSON.parse(e.target?.selectedOptions?.[0]?.dataset?.item))
  i18n.activeLanguage.value = item.name
  console.log(i18n.activeLanguage.value)
  i18nScope.change(i18n.activeLanguage.value)

}
function stop(){
  clearInterval(timeOut.value)
  timeOut.value =null
}
</script>

<template>
  <header>
      <div>当前语言：{{i18n.activeLanguage}}</div>
      <div>默认语言：{{i18n.defaultLanguage}}</div>
      <div>切换语言：</div>
      <select class="select-box" :name="i18n.activeLanguage" @change="onSelect">
        <option  class="select-item" :value="item.name" :data-item="JSON.stringify(item)" v-for="item in i18n.languages||[]" :key="item">{{item.title||''}}</option>
      </select>
  </header>
  <div>
    <a href="#">
      <img src="/vite.svg" class="logo" alt="Vite logo"/>
    </a>
    <a href="#">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo"/>
    </a>
  </div>
  <div class="box">
    <div class="box-item"
         :class="{
            'select':_val && item === _val,
            'select-circle':tabIndex===index,
            'start':index===4
          }"
         v-for="(item,index) in arr" :key="item"
         @click="()=>index===4 && !_value?run():undefined"
    >
      {{index===4?t('抽奖'):index}}
    </div>
  </div>
</template>

<style scoped lang="less">
header {
  display: flex;
  justify-content: end;
  gap: 10px;
}
.select-box{
  min-width: 100px;
  .select-item{
    width: inherit;
    border: none;
    border-radius: 0;
  }
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.box {
  width: 500px;
  height: 500px;
  display: flex;
  background-color: #fff;
  flex-wrap: wrap;
  gap: 5px;
  padding: 2.5px;
  box-sizing: border-box;
  justify-content: center;
  user-select: none;
  .box-item {
    width: calc(100% / 3 - 5px);
    height: calc(100% / 3 - 5px);
    background-color: #6e70e2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .select{
    opacity: .5;
  }
  .select-circle{
    opacity: .5;
  }
  .start{
    background-color: rgba(160, 75, 75, 0.8);
    cursor: pointer;
    font-size: 28px;
  }
}
</style>
