<template>
  <grid gutter id="RouteProjectHome">
    <Sidebar />
    <PaperWorkspace>
      <div class="text">
        <h1>Dashboard</h1>
      </div>
    </PaperWorkspace>
  </grid>
</template>

<script>
import Grid from '../Grid'
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'ProjectHome',
  components: {
    Grid,
    Sidebar,
    PaperWorkspace
  }
}
</script>

<style lang="scss">
#RouteProjectHome {
  .buttons-box {
    display: flex;
    span {
      flex: 1;
      margin: 0.5rem;
      &:first-child {
        margin-left: 1rem;
      }
      &:last-child {
        margin-right: 1rem;
      }
      div {
        height: 40vh;
        background-color: beige;
      }
    }
  }
}
</style>
