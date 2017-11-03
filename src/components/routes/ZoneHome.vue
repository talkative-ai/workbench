<template lang="pug">
  grid(gutter id="RouteZoneHome")
    sidebar
    paper
      paper-text
        h1.Headline
          span.Headline--dark You're in the zone.
          br
          | Actors say and do what you wish.
      paper-path
        grid(gutterSm fit)
          .Grid-cell
            .Paper-text
              w-button(large @click.native="$router.push({ name: 'ActorCreate', params: { zoneid: $route.params.id } })").Headline
                | Add an Actor
                span.u-arrowEast

              template(v-if="$store.state.zoneActors[$route.params.id] && $store.state.zoneActors[$route.params.id].length")
                .Headline.u-marginT3.u-marginB3 Or view an existing actor:
                div(v-for="ActorID of $store.state.zoneActors[$route.params.id]" :key="ActorID")
                  w-button(large @click.native="selectActor(ActorID)").Headline
                    | {{ actors[ActorID].Title }}
                    span.u-arrowEast
</template>

<script>
import WButton from '../elements/Button';
import Grid from '../elements/Grid';
import PaperText from '../elements/PaperText';
import PaperPath from '../elements/PaperPath';
import Sidebar from '../Sidebar';
import Paper from '../Paper';
import BGActors from '@/assets/images/milky-way.jpg';
import BGTriggers from '@/assets/images/door.jpg';

export default {
  name: 'ZoneHome',
  components: {
    WButton,
    Grid,
    PaperText,
    PaperPath,
    Sidebar,
    Paper
  },
  data() {
    return {
      BGActors,
      BGTriggers
    };
  },
  computed: {
    actors() {
      return this.$store.state.actorsMapped;
    }
  },
  methods: {
    selectActor(ID) {
      this.$store.dispatch('selectActor', ID)
      .then(() => {
        this.$router.push({ name: 'ActorHome', params: { id: ID } });
      });
    }
  }
};
</script>

<style scoped>
</style>
