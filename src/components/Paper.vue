<template lang="pug">
  column.Paper(main)
    slot
</template>

<script>
import Column from './elements/Column';

export default {
  name: 'paper',
  components: {
    Column
  }
};
</script>

<style scoped>
.Paper {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow:
    0 3pt 19pt rgba(0,0,0,0.1),
    0 9pt 38pt rgba(0,0,0,0.1);
  min-height: 50vh;
  padding: 0;
  position: relative;
}

.theme-dark .Paper {
  background-color: transparent;
  box-shadow:
    0 3pt 19pt rgba(0,0,0,0.25),
    0 9pt 38pt rgba(0,0,0,0.5);
}
</style>
