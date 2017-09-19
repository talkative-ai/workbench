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

.CanvasPath h1 {
  font-family: "HeroNew-Light";
  font-size: var(--header-s3);
  font-weight: normal;
  line-height: 1.25;
}

.CanvasPath h1 span {
  display: table;
  color: var(--color-text-dark);
}


</style>
