<template>
  <div
    :class="['CanvasText', {}]">
    <slot />
  </div>
</template>



<script scoped>
export default {
  name: 'canvas-text',
  props: {}
}
</script>



<style scoped>
@import "~/../static/styles/assets/vars.css";

.CanvasText {
  padding-top: calc(1.5 * var(--grid-gutter));
  padding-bottom: calc(1.5 * var(--grid-gutter));
  padding-left: calc(3 * var(--grid-gutter));
}

.CanvasText h1 span {
  color: var(--color-text-dark);
}
</style>
