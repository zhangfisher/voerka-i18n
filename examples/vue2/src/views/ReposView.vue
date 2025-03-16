<template>
  <div class="repos">
    <h1 :title="t('开源推荐')">{{ t("开源推荐") }}</h1>
    {{  title  }}
    {{  title2  }}
  </div>
</template>

<script>

export default {
  data: function(){
    return {
     title2: this.t("仓库")
    }
  },
  computed: {
    title() {
      return this.t("仓库")
    }
  }

}
</script>
 