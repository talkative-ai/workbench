<template>
  <grid gutter id="RouteZoneHome">
    <Sidebar />
    <PaperWorkspace>
      <CanvasText>
        <h1 class="Headline">
          <span>You're in the zone.</span><br>
          What do you want to happen?<br>
          Actors say and do what you wish!<br>
          Triggers define how the zone works.
        </h1>
      </CanvasText>

      <CanvasPath>
        <grid gutterSm fit>
          <div class="Grid-cell">
            <div
              class="CanvasPath-button CanvasPath-button--height"
              style="background-image: url(/static/img/door.jpg)"
              @click="$router.push({ name: 'ActorCreate', params: { zoneid: 1 } })">

              <span class="Button FakeButton Headline">
                Add an Actor
                <span class="u-arrowEast"></span>
              </span>
              <span v-for="za of $store.state.selectedProject.ZoneActors" :key="za.ActorID">
                <div @click="$router.push({ name: 'ActorHome', params: { id: za.ActorID } })">
                  {{ actors[za.ActorID].Title }}
                </div>
              </span>
            </div>
          </div>

          <div class="Grid-cell">
            <div class="CanvasPath-button CanvasPath-button--height">
              <span class="Button FakeButton Headline">
                Add a Trigger
                <span class="u-arrowEast"></span>
              </span>
            </div>
          </div>
        </grid>
      </CanvasPath>

    </PaperWorkspace>
  </grid>
</template>

<script>
import Grid from '../elements/Grid'
import CanvasText from '../elements/CanvasText'
import CanvasPath from '../elements/CanvasPath'
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'ZoneHome',
  components: {
    Grid,
    CanvasText,
    CanvasPath,
    Sidebar,
    PaperWorkspace
  },
  computed: {
    actors () {
      return this.$store.state.actorsMapped
    }
  }
}
</script>

<style scoped>
.CanvasPath-button--height {
  height: 50vh;
}
</style>
