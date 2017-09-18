<template lang="pug">
  #RouteActorCreate
    sidebar
    paper-workspace
      .text
        h1 You don't have any actors yet.
        h2 Create a new actor:
      .main
        .panel.small
          .upload-image
            .background
              | upload image
          div(@click='actor.Title.length && create()', :class="`button wide ${!actor.Title.length ? 'disabled' : ''}`")
            | Create actor
        .panel
          label
            span
              | Name 
              span.note (*required)
              | :
            input(placeholder="What's their name?", v-model='actor.Title')
          label
            span Sex:
            input(placeholder='Female, male, transgender, or...?')
          label
            span Age:
            input(placeholder='How old are they?')
          label
            span Relationships:
            input(placeholder='Parent? Spouse? Child?')
          label
            span Background Story:
            input(placeholder='What is their story? Why are they who they are today?')
          label
            span Character:
            input(placeholder='How do they behave?')
</template>

<script>
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'ActorCreate',
  props: ['zoneid'],
  components: {
    Sidebar,
    PaperWorkspace
  },
  data () {
    return {
      actor: {
        Title: ''
      }
    }
  },
  methods: {
    create () {
      if (this.zoneid) {
        this.actor.ZoneID = this.zoneid
      }
      this.$store.dispatch('createActor', this.actor)
    }
  }
}
</script>

<style lang="scss">
#RouteActorCreate {
  display: flex;
  justify-content: center;
  
  .upload-image {
    height: 65%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: $purple;
    margin-bottom: 2rem;
  }

}
</style>
