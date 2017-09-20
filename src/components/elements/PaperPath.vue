<template lang="pug">
  div(:class="['Paper-path']")
    slot
</template>



<script scoped>
export default {
  name: 'paper-path',
  props: {
    gutter: Boolean
  }
}
</script>



<style scoped>
@import "~/../static/styles/assets/vars.css";

.Paper-path {
  height: 100%;
  padding: 0;
}
</style>
