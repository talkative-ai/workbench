<template lang="pug">
  header#Header.Navbar.Block.Grid.Grid--withGutter
    column(menu)
      .Navbar-cell.Text--sm.Pointer(v-if="user" @click="$router.push({ name: 'ProjectSelect' })")
        icon(name="author" width="32" height="32")
        | {{ user.GivenName }}

    column(main)
      .Navbar-cell.Text--sm.u-flexJustifyBetween
        .Paper-align(
          :class="`${$route.meta.titleLink ? 'u-clickable' : ''}`"
          @click="$route.meta.titleLink ? $route.meta.titleLink() : () => {}"
        )
          | {{ title }}
          icon.u-marginL1(name="settings" width="24" height="24")

        w-button(
          lightOutline
          v-if="user && project"
          @click.native="publish()"
        )
          icon(name="google-home" width="32" height="32")
          | Publish to the Multiverse

    column(logo)
      a.Navbar-cell.Navbar-logo(href="#")
        icon(name="logo" width="32" height="32")
</template>

<script>
import '../assets/icons2';
import WButton from './elements/Button';
import Column from './elements/Column';

export default {
  name: 'navbar',
  components: {
    WButton,
    Column
  },
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
      this.$store.dispatch('publish');
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
