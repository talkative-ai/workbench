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
import Navbar from './components/Navbar.vue'

export default {
  name: 'app',
  components: {
    Navbar
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

/*
 * Themes
 */

.theme-light {
  input {
    border-color: $purple;
  }
}

.theme-dark {
  input {
    border-color: white;
  }
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


// ICONS
.postarrow::after {
  content: '\25b6';
  font-size: 1rem;
  padding-left: 0.5rem;
}

.preplus::before {
  content: '+';
  font-size: 3rem;
  font-family: "HeroNew-UltraLight";
  padding-right: 0.5rem;
}
</style>
