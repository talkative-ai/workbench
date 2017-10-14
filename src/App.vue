<template>
  <div v-if="$store.state.initializing">
    <h1>Loading AUM</h1>
  </div>
  <div v-else id="app" :class="bgImageClass">
    <navbar />
    <main id="route-pad" class="Block">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'app',
  components: {
    Navbar
  },
  data() {
    return {
      bgImageClass: this.generateAppClass(this.$route)
    };
  },
  methods: {
    generateAppClass(route) {
      return `bg-${route.meta.background} theme-${route.meta.theme}`;
    }
  },
  watch: {
    '$route'(to, from) {
      this.$set(this, 'bgImageClass', this.generateAppClass(to));
    }
  }
};
</script>

<style lang="scss">
#app {
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  display: block;
  height: 100%;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  width: 100%;
}

.bg-paper {
  background-color: var(--color-paper);
}

.bg-clouds {
  background-image: url("./assets/background/clouds1-background-light.jpg");
}

.bg-space {
  background-image: url("./assets/images/milky-way.jpg")
}

// [class*="bg-"]:after {
.bg-space:before {
  background-color: rgba(0,0,0,0.4);
  bottom: 0;
  content: " ";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
