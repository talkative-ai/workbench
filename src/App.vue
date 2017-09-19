<template>
  <div v-if="$store.state.initializing">
    <h1>Loading AUM</h1>
  </div>
  <div v-else id="app" :class="bgImageClass">
    <ComponentHeader />
    <main id="route-pad" class="Block">
      <router-view></router-view>
    </main>
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
#app {
  // min-height: 100vh;
  // background-position: center;
  // background-size: cover;
  // background-repeat: no-repeat;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
}

#route-pad {
  // width: 70vw;
  // display: inline-block;
}


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
