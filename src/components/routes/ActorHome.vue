<template>
  <div id="RouteActorHome">
    <Sidebar />
    <PaperWorkspace>
      <div class="main">
        <div class="panel small">
          <div class="upload-image">
            <div class="background" />
            upload image
          </div>
        </div>
        <div class="panel">
          <label><span>Name:</span>
            <input placeholder="What's their name?" v-model="actor.Title">
          </label>
          <label><span>Sex:</span>
            <input placeholder="Female, male, transgender, or...?">
          </label>
          <label><span>Age:</span>
            <input placeholder="How old are they?">
          </label>
          <label><span>Relationships:</span>
            <input placeholder="Parent? Spouse? Child?">
          </label>
          <label><span>Background Story:</span>
            <input placeholder="What is their story? Why are they who they are today?">
          </label>
          <label><span>Character:</span>
            <input placeholder="How do they behave?">
          </label>
        </div>
      </div>
      <button class="button" @click="$router.push({ name: 'ActorDialog', id: actor.ID })">Dialog View</button>
    </PaperWorkspace>
  </div>
</template>

<script>
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'ActorHome',
  components: {
    Sidebar,
    PaperWorkspace
  },
  computed: {
    actor () {
      return this.$store.state.selectedEntity ? this.$store.state.selectedEntity.data : {}
    }
  }
}
</script>

<style lang="scss" scoped>
#RouteActorHome {
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
