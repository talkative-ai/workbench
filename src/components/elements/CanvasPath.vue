<template>
  <div
    :class="['CanvasPath']">
    <slot />
  </div>
</template>



<script scoped>
export default {
  name: 'canvas-path',
  props: {
    gutter: Boolean
  }
}
</script>



<style scoped>
@import "~/../static/styles/assets/vars.css";

.CanvasPath {
  height: 100%;
  padding: 0;
}
</style>
