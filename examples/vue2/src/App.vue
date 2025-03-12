<template>
  <div id="app">
    <nav>
      <router-link to="/">{{ t("首页") }}</router-link> |      
      <router-link to="/repos">{{ t("开源项目") }}</router-link> |
      <router-link to="/about">{{ t("关于") }}</router-link>
    </nav>
    <LanguageBar />
    <router-view/>
  </div>
</template>

<script>
import  LanguageBar from './components/LanguageBar.vue';

export default {
  name: 'App',
  components: {
    LanguageBar
  },
};

</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
