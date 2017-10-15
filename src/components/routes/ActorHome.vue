<template lang="pug">
  grid(gutter)#RouteActorHome
    sidebar
    paper
      paper-text
        h1.Headline
          span.Headline--dark {{ actor.Title }}

        form.Form(@submit.prevent="create")
          grid(gutter)
            .Grid-cell.u-size1of3
              .picture-input(
                :style="`background-image: url(${BGActor})`"
              )

            .Grid-cell.u-size2of3
              .Headline.Headline--dark(v-if="actor.Sex")
                span {{ actor.Sex }}
                span(v-if="actor.Age") ,&nbsp;{{ actor.Age }}
              .Headline.Headline--dark(v-if="actor.Relationships")
                span {{ actor.Relationships.type }}
                | to
                span {{ actor.Relationships }}
              section(v-if="actor.Story")
                p.u-colorTextDark Background Story:
                p {{ actor.Story }}
              section(v-if="actor.Character")
                p.u-colorTextDark Character:
                p {{ actor.Character }}
              p.u-colorTextDark Where this actor appears:
              section.u-marginT3
                h2.Text.u-colorTextLite(v-if="!actorZones[actor.ID] || !actorZones[actor.ID].length") {{ actor.Title }} hasn't appeared yet
                h2.Text(v-else v-for="zoneID in actorZones[actor.ID]") {{ zones[zoneID].Title }}

          grid(gutter)
            form.Form(@submit.prevent="")
              .Grid-cell.u-size3of3
                w-button(@click.native="$router.push({ name: 'ActorDialog', id: actor.ID })") View Dialogs
</template>

<script>
import WButton from '../elements/Button';
import Grid from '../elements/Grid';
import Sidebar from '../Sidebar';
import Paper from '../Paper';
import PaperText from '../elements/PaperText';
import BGActor from '@/assets/images/actor-color.jpg';
// import PictureInput from 'vue-picture-input'

export default {
  name: 'ActorHome',
  components: {
    WButton,
    Grid,
    Sidebar,
    Paper,
    PaperText
  },
  data() {
    return {
      BGActor
    };
  },
  computed: {
    actor() {
      return this.$store.state.selectedEntity ? this.$store.state.selectedEntity.data : {};
    },

    actorZones() {
      return this.$store.state.actorZones;
    },

    zones() {
      return this.$store.state.zonesMapped;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
