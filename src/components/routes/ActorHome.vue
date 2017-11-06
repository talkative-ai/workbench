<template lang="pug">
  grid(gutter)#RouteActorHome
    sidebar
    paper
      paper-text
        h1.Headline
          span.Headline--dark {{ actor.Title }}

        form.Form(@submit.prevent="create")
          grid(gutter)
            .Grid-cell.u-size2of3
              p.u-colorTextDark Where this actor appears:
              section.u-marginT3
                h2.Text.u-colorTextLite(v-if="!actor.ZoneIDs || !actor.ZoneIDs.length") {{ actor.Title }} hasn't appeared yet
                h2.Text(v-else v-for="zoneID in actor.ZoneIDs") {{ zones[zoneID].Title }}

          grid(gutter)
            form.Form(@submit.prevent="")
              .Grid-cell.u-size3of3
                w-button(@click.native="$router.push({ name: 'ActorDialog', id: actor.ID })") View Conversations
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
      return this.$store.state.zoneMap;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
