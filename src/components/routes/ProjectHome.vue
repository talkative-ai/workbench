<template>
  <div id="RouteProjectHome">
    <Sidebar />
    <PaperWorkspace>
      <div class="text">
        <h1>Dashboard</h1>
      </div>
    </PaperWorkspace>
  </div>
</template>

<script>
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'ProjectHome',
  components: {
    Sidebar,
    PaperWorkspace
  }
}
</script>

<style lang="scss">
#RouteProjectHome {
  display: flex;
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
