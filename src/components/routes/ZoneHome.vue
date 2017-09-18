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
          button.button(@click="$router.push({ name: 'ActorCreate', params: { zoneid: $route.params.id } })")
            | Add an Actor
          div
            span(v-for='ActorID of $store.state.zoneActors[$route.params.id]', :key='ActorID')
              div(@click="selectActor(ActorID)")
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
