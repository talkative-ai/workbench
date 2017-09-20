<template lang="pug">
  header#Header.Block.Grid.Grid--withGutter
    column(menu)
      template(v-if="user")
        .Header-cell.smalltext
          icon(name="author" width="32" height="32")
          | {{ user.GivenName }}

    column(main)
      .Header-cell.smalltext.u-flexJustifyBetween
        .Paper-align(
          :class="`${$route.meta.titleLink ? 'u-clickable' : ''}`"
          @click="$route.meta.titleLink ? $route.meta.titleLink() : () => {}"
        )
          | {{ title }}
          icon.u-marginLSm.u-colorTextLight(name="settings" width="24" height="24")

        w-button(
          lightOutline
          v-if="user && project"
          @click="publish()"
        )
          icon(name="google-home" width="32" height="32")
          | Publish to the Multiverse

    column(logo)
      a.Header-cell.Logo(href="#")
        icon(name="logo" width="32" height="32")
</template>

<script>
import '../assets/icons2'
import WButton from './elements/Button'
import Column from './elements/Column'

export default {
  name: 'navbar',
  components: {
    WButton,
    Column
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    project () {
      return this.$store.state.selectedProject
    },
    title () {
      if (typeof this.$route.meta.title === 'function') return this.$route.meta.title()
      return this.$route.meta.title
    }
  },
  methods: {
    publish () {
      this.$store.dispatch('publish')
    }
  }
}
</script>

<style lang="scss">
// .Author-title {}
// .Game-title {}

.Header-cell {
  align-items: center;
  height: 100%;
  display: flex;
}

.Logo {
  color: var(--color-text-dark);

  > svg {
    margin-left: auto;
  }
}

.theme-light #Header {
  color: var(--colot-text-dark);
}

.theme-dark {
  #Header {
    color: white;
  }

  .Logo {
    color: var(--color-bg);
  }
}
</style>
