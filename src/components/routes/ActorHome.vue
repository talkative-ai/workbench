<template lang="pug">
  #RouteActorHome
    sidebar
    paper
      .main
        .panel small
          .upload-image
            .background
            | upload image
        .panel
          label
            span Name:
            input(placeholder="What's their name?" v-model="actor.Title")
          label
            span Sex:
            input(placeholder="Female, male, transgender, or...?")
          label
            span Age:
            input(placeholder="How old are they?")
          label
            span Relationships:
            input(placeholder="Parent? Spouse? Child?")
          label
            span Background Story:
            input(placeholder="What is their story? Why are they who they are today?")
          label
            span Character:
            input(placeholder="How do they behave?")
      button.button(@click="$router.push({ name: 'ActorDialog', id: actor.ID })") Dialog View
</template>

<script>
import Sidebar from '../Sidebar'
import Paper from '../Paper'

export default {
  name: 'ActorHome',
  components: {
    Sidebar,
    Paper
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
