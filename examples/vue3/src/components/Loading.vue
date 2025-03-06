<template>
    <div class="loading">
         加载段落...
    </div>
</template>
 
<style scoped>
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8); /* 半透明背景 */
    z-index: 9999; /* 确保覆盖父容器 */
  }
  </style>