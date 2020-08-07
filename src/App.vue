<template>
  <div id="app">
    <home></home>
  </div>
</template>

<script>

import Home from "@/components/home/Home";
export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
  html,body{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
