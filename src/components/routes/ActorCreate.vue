<template lang="pug">
  grid(gutter)#RouteActorCreate
    sidebar
    paper
      paper-text
        h1.Headline
          span.Headline--dark You don't have any actors yet.
          br
          | Create a new actor:
        form.Form(@submit.prevent="create")
          grid(gutter)
            .Grid-cell.u-size1of3
              picture-input(
                :style="`background-image: url(${BGActor})`"
                ref="pictureInput"
                @change="onChange"
                width="100%"
                height="600"
                margin="16"
                accept="image/jpeg,image/png"
                size="10"
                buttonClass="btn"
              )
            .Grid-cell.u-size2of3
              label
                | Name (required):
                .PlaceholderWrapper
                  input.Headline.u-colorTextDark(v-model="actor.Title")
                  .Placeholder.Headline What's their name?
              label
                | Sex:
                .PlaceholderWrapper
                  input.Headline.u-colorTextDark
                  .Placeholder.Headline Female, male, transgender?
              label
                | Age:
                .PlaceholderWrapper
                  input.Headline.u-colorTextDark
                  .Placeholder.Headline How old are they?
              label
                | Relationships:
                .PlaceholderWrapper
                  input.Headline.u-colorTextDark
                  .Placeholder.Headline Parent? Spouse? Child?
              label
                | Background Story:
                .PlaceholderWrapper
                  textarea.Headline.u-colorTextDark(rows="3")
                  .Placeholder.Headline What's their story?
              label
                | Character:
                .PlaceholderWrapper
                  textarea.Headline.u-colorTextDark(rows="3")
                  .Placeholder.Headline How do they behave?

            .Grid-cell
              .u-textRight.u-marginT4
                w-button(
                  large
                  @click.native="actor.Title.length && create()",
                  :class="`Headline ${!actor.Title.length ? 'disabled' : ''}`"
                )
                  | Create actor
                  span.u-arrowEast
</template>

<script>
import WButton from '../elements/Button'
import Grid from '../elements/Grid'
import Sidebar from '../Sidebar'
import Paper from '../Paper'
import PaperText from '../elements/PaperText'
import BGActor from '@/assets/images/actor.jpg'
import PictureInput from 'vue-picture-input'

export default {
  name: 'ActorCreate',
  props: ['zoneid'],
  components: {
    WButton,
    Sidebar,
    Grid,
    PaperText,
    Paper,
    PictureInput
  },
  data () {
    return {
      BGActor,
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
    },
    onChange () {
      console.log('New picture selected!')
      if (this.$refs.pictureInput.image) {
        console.log('Picture loaded.')
      } else {
        console.log('FileReader API not supported: use the <form>, Luke!')
      }
    }
  }
}
</script>

<style lang="scss">

</style>
