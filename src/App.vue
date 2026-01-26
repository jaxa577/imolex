<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
/* Global app styles are in assets/styles/main.css */
#app {
  min-height: 100vh;
}
</style>
