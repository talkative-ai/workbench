<template>
  <div
    :class="['Grid-cell', {
      'u-sizeMenu': menu,
      'u-sizeMain': main,
      'u-sizeLogo': logo
    }]">
    <slot />
  </div>
</template>



<script scoped>
export default {
  name: 'column',
  props: {
    menu: Boolean,
    main: Boolean,
    logo: Boolean
  }
}
</script>



<style scoped>
@import "~/../static/styles/assets/vars.css";

.u-sizeMenu {
  flex-basis: auto;
  padding-right: 0;
  width: calc(100% * 4 / 24);
}

.u-sizeMain {
  flex-basis: auto;
  width: calc(100% * 18 / 24);
}

.u-sizeLogo {
  flex-basis: auto;
  width: calc(100% * 2 / 24);
}
</style>
