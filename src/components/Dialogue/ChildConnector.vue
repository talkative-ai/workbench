<template>
  <div :style="{ width: this.width, height: this.height }"></div>
</template>

<script>
export default {
  name: 'ChildConnector',
  props: [ 'width', 'height' ]
};
</script>

<style lang="scss" scoped>
div {
  border-left: 1px solid $purple;
  border-bottom: 1px solid $purple;
  margin-left: 11pt;
  margin-top: -1pt;
}
</style>
