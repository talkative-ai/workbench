<template>
  <header v-if="user" class="Navbar Block Grid Grid--withGutter" id="Header">
    <column menu="menu">
      <w-button
        v-if="!$route.meta.outsideProject"
        lightOutline="lightOutline"
        class="Navbar-cell Text--sm Pointer" @click="$router.push({ name: 'ProjectSelect' })">
        <icon name="author" width="32" height="32"></icon>{{ user.GivenName }}
      </w-button>
      <div v-else>
        <icon name="author" width="32" height="32"></icon>
        {{ user.GivenName }}
      </div>
    </column>
    <column main="main">
      <div class="Navbar-cell Text--sm u-flexJustifyBetween">
        <w-button
          v-if="$route.meta.titleLink"
          lightOutline="lightOutline"
          class="u-clickable" @click="$route.meta.titleLink ? $route.meta.titleLink() : () => {}">
          <icon class="u-marginL1" name="settings" width="24" height="24"></icon>
          {{ title }}
        </w-button>
      </div>
    </column>
  </header>
</template>

<script>
import '../assets/icons2';
import { mapState } from 'vuex';

export default {
  name: 'navbar',
  computed: {
    ...mapState('master', {
      user: 'user'
    }),
    ...mapState('project', {
      project: 'selectedProject'
    }),
    title() {
      if (typeof this.$route.meta.title === 'function') return this.$route.meta.title();
      return this.$route.meta.title;
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
