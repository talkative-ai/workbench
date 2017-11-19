<template>
  <header class="Navbar Block Grid Grid--withGutter" id="Header">
    <column menu="menu">
      <div class="Navbar-cell Text--sm Pointer" v-if="user" @click="$router.push({ name: 'ProjectSelect' })">
        <icon name="author" width="32" height="32"></icon>{{ user.GivenName }}</div>
    </column>
    <column main="main">
      <div class="Navbar-cell Text--sm u-flexJustifyBetween">
        <div class="Paper-align" :class="{
            'u-clickable': $route.meta.titleLink
          }" @click="$route.meta.titleLink ? $route.meta.titleLink() : () => {}">{{ title }}
          <icon class="u-marginL1" name="settings" width="24" height="24"></icon>
        </div>
        <w-button lightOutline="lightOutline" v-if="user && project" @click.native="publish()">
          <icon name="google-home" width="32" height="32"></icon>Publish to the Multiverse</w-button>
      </div>
    </column>
    <column logo="logo">
      <a class="Navbar-cell Navbar-logo" href="#">
        <icon name="logo" width="32" height="32"></icon>
      </a>
    </column>
  </header>
</template>

<script>
import '../assets/icons2';
export default {
  name: 'navbar',
  computed: {
    user() {
      return this.$store.state.user;
    },
    project() {
      return this.$store.state.selectedProject;
    },
    title() {
      if (typeof this.$route.meta.title === 'function') return this.$route.meta.title();
      return this.$route.meta.title;
    }
  },
  methods: {
    publish() {
      this.$store.dispatch('project/publish');
    }
  }
};
</script>

<style lang="scss">
// .Author-title {}
// .Game-title {}
// .theme-light #Header {
.Navbar {
  margin: 0 !important;
}

.Navbar-cell {
  align-items: center;
  color: var(--color-text-lite);
  display: flex;
  height: 100%;
  position: relative;
  transition: color 0.5s ease-in-out;

  // &:hover {
  //   color: var(--color-text-lite);
  // }
}

.Navbar-logo {
  // color: var(--color-text-dark);

  > svg {
    margin-left: auto;
  }
}

.theme-dark .Navbar-cell {
  color: var(--color-text);
}
</style>
