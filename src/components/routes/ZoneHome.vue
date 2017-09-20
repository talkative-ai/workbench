<template>
  <grid gutter id="RouteZoneHome">
    <sidebar />
    <paper>
      <paper-text>
        <h1 class="Headline">
          <span>You're in the zone.</span><br>
          What do you want to happen?<br>
          Actors say and do what you wish!<br>
          Triggers define how the zone works.
        </h1>
      </paper-text>

      <paper-path>
        <grid gutterSm fit>
          <div class="Grid-cell">
            <div
              class="Paper-path-button Paper-path-button--height"
              :style="`background-image: url(${BGActors})`"
              @click="$router.push({ name: 'ActorCreate', params: { zoneid: 1 } })">

              <span class="Button Headline">
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
            <div
              class="Paper-path-button Paper-path-button--height"
              :style="`background-image: url(${BGTriggers})`">
              <span class="Button Headline">
                Add a Trigger
                <span class="u-arrowEast"></span>
              </span>
            </div>
          </div>
        </grid>
      </paper-path>

    </paper>
  </grid>
</template>

<script>
import Grid from '../elements/Grid'
import PaperText from '../elements/PaperText'
import PaperPath from '../elements/PaperPath'
import Sidebar from '../Sidebar'
import Paper from '../Paper'
import BGActors from '@/assets/images/door.jpg'
import BGTriggers from '@/assets/images/milky-way.jpg'

export default {
  name: 'ZoneHome',
  components: {
    Grid,
    PaperText,
    PaperPath,
    Sidebar,
    Paper
  },
  data () {
    return {
      BGActors,
      BGTriggers
    }
  },
  computed: {
    actors () {
      return this.$store.state.actorsMapped
    }
  }
}
</script>

<style scoped>
.Paper-path-button--height {
  height: 50vh;
}
</style>
