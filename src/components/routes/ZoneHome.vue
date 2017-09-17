<template lang="pug">
  #RouteZoneHome
    sidebar
    paper-workspace
      .text
        h1 You're in the zone.
        h1 What do you want to happen?
      span.buttons-box
        span
          h1 Actors say and do what you wish!
          button.button(@click="$router.push({ name: 'ActorCreate', params: { zoneid: 1 } })")
            | Add an Actor
          div
            span(v-for='ActorID of $store.state.zoneActors[$route.params.id]', :key='ActorID')
              div(@click="$router.push({ name: 'ActorHome', params: { id: ActorID } })")
                | {{ actors[ActorID].Title }}
        span
          h1 Triggers define how the zone works!
          button.button
            | Add a Trigger
</template>

<script>
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'ZoneHome',
  components: {
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

<style lang="scss">
#RouteZoneHome {
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
    }
  }
}
</style>
