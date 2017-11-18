<template>
  <div :class="gridClass">
    <slot></slot>
  </div>
</template>

<script scoped>
export default {
  name: 'grid',
  computed: {
    gridClass() {
      return ['Grid', {
        'Grid--withGutter': this.gutter,
        'Grid--withGutterSm': this.gutterSm,
        'Grid--fit': this.fit,
        'u-flexAlignItemsStretch': this.fill
      }];
    }
  },
  props: {
    gutter: Boolean,
    gutterSm: String,
    fit: Boolean,
    fill: Boolean
  }
};
</script>
