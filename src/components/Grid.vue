<template>
  <div
    :class="['Grid', {
      'Grid--withGutter': gutter
    }]">
    <slot />
  </div>
</template>



<script scoped>
export default {
  name: 'grid',
  props: {
    gutter: Boolean
  }
}
</script>



<style >
/*@import "~/../static/styles/assets/vars.css";*/

</style>
