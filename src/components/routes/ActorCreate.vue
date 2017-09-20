<template lang="pug">
  grid#RouteActorCreate(gutter)
    sidebar
    paper
      paper-text
        h1.Headline You don't have any actors yet.
        h2.Headline Create a new actor:
      paper-text
        .panel.small
          .upload-image
            .background
            | upload image
          div(
            @click="actor.Title.length && create()",
            :class="`button wide ${!actor.Title.length ? 'disabled' : ''}`"
          )
            Create actor
        .panel
          label
            span Name
              span.note (*required)
              | :
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
</template>

<script>
import Grid from '../elements/Grid'
import Sidebar from '../Sidebar'
import Paper from '../Paper'
import PaperText from '../elements/PaperText'

export default {
  name: 'ActorCreate',
  props: ['zoneid'],
  components: {
    Sidebar,
    Grid,
    PaperText,
    Paper
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
.upload-image {
  height: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: $purple;
  margin-bottom: 2rem;
}
</style>
