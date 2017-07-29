<template>
  <div id="app" :class="bgImageClass">
    <ComponentHeader />
    <router-view></router-view>
  </div>
</template>

<script>
import ComponentHeader from './components/Header.vue'

let bgImageClasses = {
  clouds: 'bg-clouds',
  space: 'bg-milkyway'
}

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
      return `${bgImageClasses[route.meta.background]} theme-${route.meta.theme}`
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

.bg-clouds {
  background-image: url("./assets/background/clouds1-background-light.jpg");
}

.bg-milkyway {
  background-image: url("./assets/images/milky-way.jpg")
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
