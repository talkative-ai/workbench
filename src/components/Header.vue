<template>
  <header class="Block Grid Grid--withGutter" id="Header">
    <column menu>
      <template v-if="user">
        <div class="Header-cell smalltext">
          <icon class="" name="author" width="30" height="30"></icon>
          {{ user.GivenName }}
        </div>
      </template>
    </column>

    <column main>
      <div class="Header-cell u-flexJustifyBetween">
        <div
        class="Canvas-align"
        :class="`smalltext title ${$route.meta.titleLink ? 'u-clickable' : ''}`"
        @click="$route.meta.titleLink ? $route.meta.titleLink() : () => {}">
          {{ title }}
        </div>

        <div class="smalltext">
          <v-button
            lightOutline
            v-if="user && project"
            @click="publish()">
            <icon class="" name="google-home" width="32" height="32"></icon>
            Publish to the Multiverse
          </v-button>
        </div>
      </div>
    </column>

    <column logo>
      <a href="#" class="Header-cell Logo">
        <icon name="logo" width="32" height="32"></icon>
      </a>
    </column>

  </header>
</template>

<script>
import '../assets/icons2'
import VButton from './elements/Button'
import Column from './elements/Column'

export default {
  name: 'Header',
  components: {
    VButton,
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
.Header-cell {
  align-items: center;
  height: 100%;
  display: flex;
}

.Logo {
  color: var(--color-brand);

  > svg {
    margin-left: auto;
  }
}

.theme-light #Header {
  color: black;
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
