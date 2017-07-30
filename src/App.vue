<template>
  <div id="app" :class="bgImageClass">
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
  },
  data () {
    return {
      bgImageClass: this.generateAppClass(this.$route)
    }
  },
  methods: {
    generateAppClass (route) {
      return `bg-${route.meta.background} theme-${route.meta.theme}`
    }
  },
  watch: {
    '$route' (to, from) {
      this.$set(this, 'bgImageClass', this.generateAppClass(to))
    }
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#app {
  min-height: 100vh;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

input {
  width: 50%;
  margin-top: 1rem;
  font-size: 2.5rem;
  padding: 0.5rem 0;
  font-weight: 100;
}

.bg-clouds {
  background-image: url("./assets/background/clouds1-background-light.jpg");
}

.bg-space {
  background-image: url("./assets/images/milky-way.jpg")
}

.bg-paper {
  background-color: #f7f7f7;
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

a {
  color: inherit;
  font-style: inherit;
  text-decoration: none;
}
</style>
