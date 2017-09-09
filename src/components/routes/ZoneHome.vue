<template>
  <div id="RouteZoneHome">
    <Sidebar />
    <PaperWorkspace>
      <div class="text">
        <h1>You're in the zone.</h1>
        <h1>What do you want to happen?</h1>
      </div>
      <span class="buttons-box">
        <span>
          <h1>Actors say and do what you wish!</h1>
          <button
            class="button"
            @click="$router.push({ name: 'ActorCreate', params: { zoneid: 1 } })">
            Add an Actor
          </button>
          <div>
            <span v-for="za of $store.state.selectedProject.ZoneActors" :key="za.ActorID">
              <div @click="$router.push({ name: 'ActorHome', params: { id: za.ActorID } })">
                {{ actors[za.ActorID].Title }}
              </div>
            </span>
          </div>
        </span>
        <span>
          <h1>Triggers define how the zone works!</h1>
          <button class="button">
            Add a Trigger
          </button>
        </span>
      </span>
    </PaperWorkspace>
  </div>
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
