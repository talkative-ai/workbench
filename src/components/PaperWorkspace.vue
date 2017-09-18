<template>
  <column main class="PaperWorkspace">
    <slot></slot>
  </column>
</template>

<script>
import Column from './Column'

export default {
  name: 'PaperWorkspace',
  components: {
    Column
  }
}
</script>

<style lang="scss" scoped>
.PaperWorkspace {
  align-self: baseline;
  background-color: white;
  box-shadow: 0pt 3pt 20pt rgba(0,0,0,0.2);
  padding-top: var(--grid-gutter);
  padding-bottom: var(--grid-gutter);
  min-height: 50vh;

  // h1,
  // h2 {
  //   font-weight: 100;
  //   margin: 0;
  //   color: $lighter-grey;
  //   font-size: 2rem;
  // }
  //
  // h2 {
  //   color: black;
  // }
  //
  // .text,
  // .main {
  //   margin: 2.5rem 4rem;
  // }
  //
  // .main {
  //   display: flex;
  //
  //   .panel {
  //     flex: 1;
  //     margin: 1rem;
  //     &.small {
  //       flex: 0.4;
  //     }
  //   }
  // }
}
</style>
