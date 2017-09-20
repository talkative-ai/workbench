<template lang="pug">
  div(:class="['Paper-text', {}]")
    slot
</template>



<script scoped>
export default {
  name: 'paper-text',
  props: {}
}
</script>



<style scoped>
@import "~/../static/styles/assets/vars.css";

.Paper-text {
  padding-top: calc(1.5 * var(--grid-gutter));
  padding-bottom: calc(3 * var(--grid-gutter));
  padding-left: calc(3 * var(--grid-gutter));
}

.Paper-text h1 span {
  color: var(--color-text-dark);
}
</style>
