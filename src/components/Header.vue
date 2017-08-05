<template>
  <div id="Header">
    <span class="icon small img-profile" />
    <div class="username">Wyatt</div>
    <div class="spring"></div>
    <div class="logo"><img src="../assets/logo/32.png" /></div>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss">
#Header {
  display: flex;
  padding: 15pt;
  align-items: center;
}

.theme-dark > #Header {
  color: white;
  .logo img {
    filter: grayscale(100%) brightness(1000%);
  }
}

.theme-light > #Header {
  color: black;
  .logo img {
    filter: grayscale(100%) brightness(0);
  }
}

.icon {
  &.img-profile {
    background: url('../assets/icons/icon-profile.svg');
  }
  &.small {
    width: 16pt;
    height: 16pt;
    margin: 5pt;
  }
}
</style>
