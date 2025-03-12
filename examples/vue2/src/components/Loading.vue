<template>
    <span :style="style">{{ tips }}</span>
  </template>
  
  <script>
  export default {
    name: 'VoerkaI18nLoading',
    props: {
      tips: {
        type: String,
        default: 'Loading...'
      }
    },
    computed: {
      style() {
        return {
          position: 'absolute',
          top: 0,
          left: 0,
          fontSize: '1em',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999
        };
      }
    }
  };
  </script>
  
  <style scoped>
  /* 你可以在这里添加额外的样式 */
  </style>