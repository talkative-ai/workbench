<template>
  <div id="app" :class="bgImageClass">
    <div id="app-pad">
      <ComponentHeader />
      <router-view></router-view>
    </div>
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

* {
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
}

#app-pad {
  width: 70vw;
  display: inline-block;
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
    border-bottom: 0px solid $purple;
  }
}

.theme-dark {
  input {
    border-bottom: 0px solid white;
  }
}

label {
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  font-weight: bold;
  .note {
    color: $purple;
  }
  input {
    margin-top: 0;
    border-bottom-width: 0;
    font-size: 2rem;
    width: 100%;
    &:focus {
      border-bottom-width: 1px;
    }
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
  opacity: 1;
  justify-content: center;

  &.wide {
    width: 100%;
  }

  &.hidden {
    opacity: 0;
    cursor: default;
    pointer-events: none;
  }

  &.disabled {
    cursor: default;
    border-color: lightgrey;
    color: lightgrey;
  }

  transition: background-color 0.1s, color 0.1s, opacity 0.2s ease-out;

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

.icon {

  &.img-profile {
    background: url('./assets/icons/icon-profile.svg') transparent no-repeat;
  }
  &.img-actor {
    background: url('./assets/icons/icon-actor.svg') transparent no-repeat;
  }
  &.small {
    width: 24pt;
    height: 24pt;
    margin: 5pt;
  }
  &.sized {
    width: 1.5rem;
    height: 1.5rem;
    margin: 5pt 5pt 5pt 0;
  }
}
</style>
