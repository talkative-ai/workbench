<template>
  <div id="RouteDialogHome">
    <Sidebar />
    <PaperWorkspace>
      {{ $route.params.dialog_id }}
    </PaperWorkspace>
  </div>
</template>

<script>
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'DialogHome',
  components: {
    Sidebar,
    PaperWorkspace
  }
}
</script>

<style lang="scss" scoped>
#RouteDialogHome {
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
