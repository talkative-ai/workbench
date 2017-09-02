<template>
  <div id="Header">
    <div class="user">
      <template v-if="user">
        <span class="icon small img-profile" />
        {{ user.GivenName }}
      </template>
    </div>
    <div class="title">
      {{ $route.meta.title }}
    </div>
    <div class="spring" />
    <div class="logo"><img src="../assets/logo/32.png" /></div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    user () {
      return this.$store.state.user
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
