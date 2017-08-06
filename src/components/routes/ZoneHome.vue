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
          <div @click="$router.push({ name: 'ActorCreate' })">
            Add an Actor
          </div>
        </span>
        <span>
          <h1>Triggers define how the zone works!</h1>
          <div>
            Add a Trigger
          </div>
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
      div {
        height: 40vh;
        background-color: beige;
      }
    }
  }
}
</style>
