<template>
  <grid gutter id="RouteProjectHome">
    <Sidebar />
    <PaperWorkspace>
      <CanvasText>
        <h1 class="Headline">Dashboard</h1>
      </CanvasText>
    </PaperWorkspace>
  </grid>
</template>

<script>
import Grid from '../elements/Grid'
import CanvasText from '../elements/CanvasText'
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'ProjectHome',
  components: {
    Grid,
    CanvasText,
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
