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
  font-family: 'Quicksand', Helvetica, Arial, sans-serif;
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
  background-color: transparent;
  border: none;
  outline: none;
}

.theme-light {
  input {
    border-bottom: 1px solid $purple;
  }
}

.theme-dark {
  input {
    border-bottom: 1px solid white;
  }
}

.bg-clouds {
  background-image: url("./assets/background/clouds1-background-light.jpg");
}

.bg-space {
  background-image: url("./assets/images/milky-way.jpg")
}


.button {
  color: $purple;
  background-color: transparent;
  border: 1pt solid $purple;
  padding: 1rem 2rem;
  font-size: 2rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  transition: background-color 0.1s, color 0.1s;

  &::after {
    content: '\25b6';
    font-size: 1rem;
    padding-left: 0.5rem;
  }

  &:hover {
    background-color: $purple;
    color: white;
  }

  &.no-outline {
    border: 0;
  }
}

.theme-dark {
  .button {
    border-color: white;
    color: white;
    &:hover {
      background-color: transparent;
    }
  }
}

.bg-paper {
  background-color: #f7f7f7;
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
