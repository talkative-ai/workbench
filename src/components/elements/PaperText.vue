<template>
  <div :class="paperTextClass">
    <slot></slot>
  </div>
</template>

<script scoped>
export default {
  name: 'paper-text',
  computed: {
    paperTextClass() {
      return ['Paper-text', {
        'full-height': this.full
      }];
    }
  },
  props: {
    full: Boolean
  }
};
</script>

<style scoped>
.Paper-text {
  padding-top: calc(1.5 * var(--grid-gutter));
  padding-bottom: 0;
  padding-left: calc(3 * var(--grid-gutter));
  padding-right: calc(2 * var(--grid-gutter));
}

.full-height {
  height: 100%;
}
</style>
