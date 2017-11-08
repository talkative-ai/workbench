<template lang="pug">
  grid(gutter id="RouteZoneHome")
    sidebar
    paper
      paper-text
        h1.Headline
          span.Headline--dark You're in the zone.
          br
          | Actors say and do what you wish.
      .Grid-cell
        .Paper-text
          w-button(large outline @click.native="$router.push({ name: 'ActorCreate', params: { zoneid: $route.params.id } })").Headline
            | create an actor
          .actor-wrap
            .actor-item(
              v-for="(actor, id) in $store.state.actorMap"
              :class="!$store.state.zoneActors[$route.params.id] || !$store.state.zoneActors[$route.params.id][id] ? 'blank' : ''"
              :key="id")
              h1.Headline {{ actors[id].Title }}
              .button-grid
                w-button(
                  class="add-button"
                  v-if="!$store.state.zoneActors[$route.params.id] || !$store.state.zoneActors[$route.params.id][id]"
                  @click.native="addActor(id)"
                )
                  fa-icon(name="plus")
                  | Add
                w-button(
                  outline
                  v-if="$store.state.zoneActors[$route.params.id] && $store.state.zoneActors[$route.params.id][id]"
                  @click.native="removeActor(id)"
                )
                  fa-icon(name="times")
                  | Remove
                w-button(@click.native="selectActor(id)")
                  fa-icon(name="pencil")
                  | Edit
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
      return this.$store.state.actorMap;
    }
  },
  methods: {
    selectActor(ID) {
      this.$store.dispatch('selectActor', ID)
      .then(() => {
        this.$router.push({ name: 'ActorHome', params: { id: ID } });
      });
    },
    removeActor(ID) {
      this.$store.dispatch('removeActorFromZone', { ActorID: ID, ZoneID: this.$route.params.id });
    },
    addActor(ID) {
      this.$store.dispatch('addActorToZone', { ActorID: ID, ZoneID: this.$route.params.id });
    }
  }
};
</script>

<style lang="scss" scoped>
.actor-wrap {
  display: flex;
  flex-wrap: wrap;
  div {
    margin: 10pt 20pt 10pt 0;
  }
}
.actor-item {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-brand);
  padding: 5pt 5pt 0 5pt;
  box-shadow: 0 0 5pt rgba(0,0,0,0.4);

  &.blank {
    box-shadow: none;
    border-color: grey;
    background-color: rgba(0,0,0,0.05);
    h1 {
      opacity: 0.5;
    }
  }
}
.Button {
  svg {
    margin-right: 5pt;
  }
}
</style>
