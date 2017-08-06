<template>
  <div class="PaperWorkspace">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PaperWorkspace'
}
</script>

<style lang="scss" scoped>
  .PaperWorkspace {
    align-self: baseline;
    min-height: 20vh;
    width: 100%;
    background-color: white;
    box-shadow: 0pt 3pt 20pt rgba(0,0,0,0.2);

    h1, h2 {
      font-weight: 100;
      margin: 0;
      color: $lighter-grey;
      font-size: 2rem;
    }

    h2 {
      color: black;
    }

    .text, .main {
      margin: 2.5rem 4rem;
    }

    .main {
      display: flex;

      .panel {
        flex: 1;
        margin: 1rem;
        &.small {
          flex: 0.4;
        }
      }
    }
  }
</style>
