<template lang="pug">
  #Header
    .user
      template(v-if='user')
        span.icon.small.img-profile
          | {{ user.GivenName }}
    div(@click='$route.meta.titleLink ? $route.meta.titleLink() : () => {}', :class="`title ${$route.meta.titleLink ? 'clickable' : ''}`")
      | {{ title }}
    .spring
    button.button(v-if='user && project', @click='publish()') Publish to the Multiverse
    .logo
      img(src='../assets/logo/32.png')
</template>

<script>
export default {
  name: 'Header',
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
#Header {
  display: flex;
  padding: 15pt 0;
  align-items: center;
  width: 100%;
  font-family: 'HeroNew-Regular', Helvetica, Arial, sans-serif;
}

.clickable {
  cursor: pointer;
}

.user {
  width: 15vw;
  display: flex;
  align-items: center;
}

.logo {
  padding: 0 15pt;
}

.theme-dark #Header {
  color: white;
  .logo img {
    filter: grayscale(100%) brightness(1000%);
  }
}

.theme-light #Header {
  color: black;
  .logo img {
    filter: grayscale(100%) brightness(0);
  }
}
</style>
