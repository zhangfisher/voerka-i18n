<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="#" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>安装方法</h3>
    <ul>
      <li><a href="#" target="_blank" rel="noopener">router</a></li>
      <li><a href="#" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="#" target="_blank" rel="noopener">typescript</a></li>
    </ul>
    <h3>特性</h3>
    <ul>
      <li><a href="#" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="#" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="#" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="#" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="#" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3></h3>
    <ul>
      <li><a href="#" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="#" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="#" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="#" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="#" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Translate } from '@voerkai18n/vue2';

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    Translate,
  },
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
