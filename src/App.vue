<template>
  <div id="app">
    <ComponentHeader />
    <router-view></router-view>
  </div>
</template>

<script>
import ComponentHeader from './components/Header.vue'

export default {
  name: 'app',
  components: {
    ComponentHeader
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
}
body {
  background-image: url("./assets/background/clouds1-background-light.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

input {
  background-color: rgba(0,0,0,0);
  border: none;
  border-bottom: 1px solid $light-grey;
  outline: none;
}

.spring {
  flex: 1;
}
</style>
