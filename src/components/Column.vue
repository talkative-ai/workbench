<template>
  <div
    :class="['Grid-cell', {
      'u-sizeMenu': menu,
      'u-sizeMain': main,
      'u-sizeLogo': logo
    }]">
    <template v-if="footer">
      <slot />
    </template>
    <template v-else-if="textColumn">
      <container>
        <div class="u-size11of12 u-sm-size3of4">
          <slot />
        </div>
      </container>
    </template>
    <template v-else>
      <slot />
    </template>
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

/*.Column {
  flex-basis: auto;
  padding-left: var(--grid-gutter);
  padding-right: var(--grid-gutter);
  width: 100%;
}

.Column.menu {
  padding-right: 0;
  width: calc(100% * 4 / 24);
}

.Column.main {
  width: calc(100% * 19 / 24);
}

.Column.logo {
  width: calc(100% * 1.5 / 24);
}*/

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
