<template>
    <ul>
        <li v-for="item in items">{{ item.title }}</li>
    </ul>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        default: ()=>([])
      }
    }
  };
  </script>
  