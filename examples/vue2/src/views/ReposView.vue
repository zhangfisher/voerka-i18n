<template>
  <div class="repos">
    <h1 :title="t('开源推荐')">{{ t("开源推荐") }}</h1>
    {{  title  }}
    {{  title2  }}
    <p>-------------</p>
    <List :items="titles" />      
  </div>
</template>

<script>
import List from '../components/List.vue'
export default {
  components: {
    List
  },
  data: function(){
    return {
     title2: this.t("仓库")
    }
  },
  computed: {
    title() {
      return this.t("仓库")
    },
    titles(){
      return [
        {
          title: this.t("仓库")
        },
        {
          title: this.t("仓库")
        }
      ]
    }
  }

}
</script>
 