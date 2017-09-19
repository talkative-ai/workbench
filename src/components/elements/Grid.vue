<template>
  <div
    :class="['Grid', {
      'Grid--withGutter': gutter,
      'Grid--withGutterSm': gutterSm,
      'Grid--fit': fit,
      'u-flexAlignItemsStretch': fill
    }]">
    <slot />
  </div>
</template>



<script scoped>
export default {
  name: 'grid',
  props: {
    gutter: Boolean,
    gutterSm: Boolean,
    fit: Boolean,
    fill: Boolean
  }
}
</script>



<style >
/*@import "~/../static/styles/assets/vars.css";*/

</style>
