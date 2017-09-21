<template lang="pug">
  div(:class="gridClass")
    slot
</template>



<script scoped>
export default {
  name: 'grid',
  computed: {
    gridClass () {
      return ['Grid', {
        'Grid--withGutter': this.gutter,
        'Grid--withGutterSm': this.gutterSm,
        'Grid--fit': this.fit,
        'u-flexAlignItemsStretch': this.fill
      }]
    }
  },
  props: {
    gutter: Boolean,
    gutterSm: Boolean,
    fit: Boolean,
    fill: Boolean
  }
}
</script>



<style >

</style>
