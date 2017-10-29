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

// TODO: Componentize this
// The reason it's not being used in DialogNode.vue is because of DummyNode.vue
.DialogNode {
  display: inline-flex;
  flex-direction: column;
  user-select: none;
  margin-top: -1px;
  min-width: 400px;
  max-width: 400px;
}
.button-grid {
  padding: 10pt 0px;
}
.entry, .inner-values {
  display: flex;
}
.ai-wrap {
  margin: 10pt 0;
  padding: 10pt 0;
  border-top: 1px solid $purple;
}
.cover {
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: -1px;
  width: 401px;
  z-index: 10;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  &.editing {
    opacity: 1;
    border: 2px dashed $purple;
    pointer-events: none;
    flex-direction: column;
  }
  h1 {
    color: $purple;
  }
  &.opaque {
    opacity: 1;
    cursor: default;
    border: 1px solid $purple;
    background-color: var(--color-paper-low-opacity);
  }
}
.selected {
  border: 1px solid $purple;
  opacity: 1;
}
.cover-wrap {
  position: absolute;
  top: 0px;
  bottom: -1px;
  left: -1px;
  z-index: 10;
  .edit-bar {
    opacity: 0;
  }
  &:hover {
    z-index: 20;
    .cover {
      opacity: 1;
      border: 1px solid $purple;
      background-color: var(--color-paper-low-opacity);
      cursor: pointer;
      &.selected {
        cursor: default;
      }
    }
    .edit-bar {
      opacity: 1;
    }
  }
}
.edit-bar {
  bottom: -31pt;
  position: absolute;
  left: 0;
  right: 0;
  width: 400px;
  height: 30pt;
  &.with-error {
    height: 60pt;
    bottom: -61pt;
    align-items: baseline;
    justify-content: space-between;
    padding: 10pt;
    flex-direction: column;
  }
  .error {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: pink;
    color: black;
    font-weight: bold;
    padding: 0 5pt;
  }
  display: flex;
  align-items: center;
  background-color: var(--color-paper);
  box-shadow: 0 0 5pt rgba(0,0,0,0.2);
  padding-left: 10pt;
  z-index: 100;
}
.vspacer {
  height: 20pt;
  border-left: 1px solid $purple;
  margin-top: -1px;
}
.actor-vals {
  color: $purple;
  border-left: 1px solid $purple;
}
.actions {
  cursor: default;
  pointer-events: none;
  display: inline-block;
  padding: 0.25rem;
  background-color: $purple;
  color: white;
}
.after-values-space {
  border-left: 1px solid $purple;
  border-bottom: 1px solid $purple;
  margin-left: 11pt;
  margin-top: -1pt;
}
.ball {
  width: 0.25rem;
  height: 0.25rem;
  border: 0.25rem solid $purple;
  border-radius: 100%;
  position: absolute;
  display: inline-block;
  margin-left: -0.25rem;
  margin-top: -0.25rem;
}
.child-dialog-head {
  position: relative;
  margin: 0 0 1rem 0.25rem;
}
.wrap {
  padding-left: 10pt;
  border: 1px solid transparent;
  position: relative;
}
.inner-values {
  padding: 0.25rem;
  padding: 5pt 0.25rem 10pt 0.25rem;
}
.child-dialogs {
  display: flex;
}
.child-dialog-head-nth {
  border-top: 1px solid $purple;
}
.entry {
  position: relative;
  left: -10pt;
  padding: 5pt 0;
}
.black {
  background-color: black;
}
</style>
