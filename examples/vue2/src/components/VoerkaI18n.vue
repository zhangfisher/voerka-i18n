<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>      
      <Translate message="适用于Javascript/Vue/React/ReactNative的国际化解决方案"/>
    </p> 
    <h3>{{ t("主要特性") }}</h3>
    <ul>
      <li><Translate message="适用任意场景"/></li>
      <li><Translate message="全流程工具链"/></li>
      <li><Translate message="全自动翻译"/></li>
      <li><Translate message="多库联动"/></li>
      <li><Translate message="语言补丁"/></li>
      <li><Translate message="测试覆盖率"/></li>
    </ul>
    <h3><Translate message="用心开源，精良制作"/></h3>
    <ul>
      <li><Translate message="联系我们"/></li> 
      <li><Translate message="常见问题"/></li> 
      <li><Translate message="版权所有"/></li> 
      <li><Translate message="友情链接"/></li> 
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'; 
export default Vue.extend({
  name: 'i18n',
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
