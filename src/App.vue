<template>
  <div id="app">
    <login></login>
    <router-view></router-view>
  </div>
</template>

<script>

import Login from "@/components/login/Login";
export default {
  name: 'App',
  components: {
    Login,
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
