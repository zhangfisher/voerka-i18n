

<template> 
  <div class="min-h-full flex flex-col">
      <Navbar/>
      <div class="min-h-100 mt-18 py-6">
        <router-view/>  
      </div>      
      <Footer/>
  </div> 
</template>

<script setup>

import  Footer from './components/Footer'
import  Navbar from './components/Navbar'

 </script>