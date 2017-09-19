<template>
  <column main class="Canvas">
    <slot></slot>
  </column>
</template>

<script>
import Column from './elements/Column'

export default {
  name: 'PaperWorkspace',
  components: {
    Column
  }
}
</script>

<style scoped>
.Canvas {
  background-color: white;
  box-shadow:
    0 3pt 19pt rgba(0,0,0,0.1),
    0 9pt 38pt rgba(0,0,0,0.1);
  min-height: 50vh;
  padding: 0;
  position: relative;
}
</style>
