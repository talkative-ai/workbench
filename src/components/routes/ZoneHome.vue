<template lang="pug">
  grid(gutter id="RouteZoneHome")
    sidebar
    paper
      paper-text
        h1.Headline
          span You're in the zone.
          br
          | What do you want to happen?
          br
          | Actors say and do what you wish!
          br
          | Triggers define how the zone works.

      paper-path
        grid(gutterSm fit)
          .Grid-cell
            .Paper-path-button.Paper-path-button--height(
              :style="`background-image: url(${BGActors})`"
              @click="$router.push({ name: 'ActorCreate', params: { zoneid: $route.params.id } })"
            )
              span.Button.Headline
                | Add an Actor
                span.u-arrowEast
              span(v-for="ActorID of $store.state.zoneActors[$route.params.id]" :key="ActorID")
                div(@click="selectActor(ActorID)")
                  | {{ actors[ActorID].Title }}

          .Grid-cell
            .Paper-path-button.Paper-path-button--height(
              :style="`background-image: url(${BGTriggers})`"
            )
              span.Button.Headline
                | Add a Trigger
                span.u-arrowEast
</template>

<script>
import Grid from '../elements/Grid'
import PaperText from '../elements/PaperText'
import PaperPath from '../elements/PaperPath'
import Sidebar from '../Sidebar'
import Paper from '../Paper'
import BGActors from '@/assets/images/milky-way.jpg'
import BGTriggers from '@/assets/images/door.jpg'

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
  },
  methods: {
    selectActor (ID) {
      this.$store.dispatch('selectActor', ID)
      .then(() => {
        this.$router.push({ name: 'ActorHome', params: { id: ID } })
      })
    }
  }
}
</script>

<style scoped>
.Paper-path-button--height {
  height: 50vh;
}
</style>
