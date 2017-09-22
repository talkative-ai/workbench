<template lang="pug">
  grid#RouteActorCreate(gutter)
    sidebar
    paper
      paper-text
        h1.Headline
          span.Headline--dark You don't have any actors yet.
          br
          | Create a new actor:
        form.Form(@submit.prevent="create")
          grid(gutter).u-width100
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
                  textarea.Headline.u-colorTextDark(rows="4")
                  .Placeholder.Headline What is their story? Why are they who they are today?
              label
                | Character:
                .PlaceholderWrapper
                  textarea.Headline.u-colorTextDark(rows="4")
                  .Placeholder.Headline How do they behave?

            .Grid-cell
              .u-textRight.u-marginT4
                w-button(
                  large
                  @click="actor.Title.length && create()",
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
.picture-input,
.upload-image {
  align-items: center;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  color: white;
  display: flex;
  height: 400px;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  width: 100%;

  &:before {
    // @apply --mask;
    background-color: rgba(110, 0, 221, 0.7);
    bottom: 0;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
