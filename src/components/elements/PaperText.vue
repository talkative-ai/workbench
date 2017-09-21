<template lang="pug">
  div(:class="paperTextClass")
    slot
</template>



<script scoped>
export default {
  name: 'paper-text',
  computed: {
    paperTextClass () {
      return ['Paper-text', {
        'full-height': this.full
      }]
    }
  },
  props: {
    full: Boolean
  }
}
</script>



<style scoped>
.Paper-text {
  padding-top: calc(1.5 * var(--grid-gutter));
  padding-bottom: calc(2 * var(--grid-gutter));
  padding-left: calc(3 * var(--grid-gutter));
  padding-right: calc(2 * var(--grid-gutter));
}

.full-height {
  height: 100%;
}
</style>
