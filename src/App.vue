<template>
  <div id="app" :class="bgImageClass">
    <div v-if="isLoading" class="loading-splash">
      <img src="./assets/images/aum-logo-color.256.png" />
      <h1>Loading...</h1>
    </div>
    <navbar />
    <main id="route-pad" class="Block">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import { mapState } from 'vuex';

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
  mounted() {
    this.$store.dispatch('master/bootIntercom');
  },
  computed: {
    ...mapState('master', {
      isLoading: 'isLoading'
    })
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
input, select, textarea {
  font-family: inherit;
}
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
@keyframes spin { 100% { transform:rotate(360deg); } }
.loading-splash {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.75);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  flex-direction: column;
  img {
    animation:spin 20s linear infinite;
  }
  h1 {
    text-shadow: 2px 2px 0px black;
    color: #6d00dd;
    font-size: 3rem;
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

.Pointer {
  cursor: pointer;
}


.button-grid {
  > * {
    margin: 0 5pt;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.button-grid-small {
  display: flex;
  width: 100%;
  > * {
    margin: 0 2.5pt;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.button-grid {
  padding: 10pt 0px;
  display: flex;
  width: 100%;
}
.flex {
  display: flex;
  align-items: flex-start;
}
.flex-column {
  flex-direction: column;
}
h1 {
  &.danger {
    color: $danger !important;
  }
}
h2 {
  &.danger {
    color: $danger !important;
  }
}
</style>
