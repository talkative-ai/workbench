<template>
  <div id="Header">
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
</style>
