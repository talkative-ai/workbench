<template lang="pug">
  grid(gutter id="RouteZoneHome")
    sidebar
    paper
      paper-text
        h1.Headline
          span.Headline--dark You're in the zone.
      .Grid-cell
        .Paper-text
          .info-box
            w-button(large outline v-if="!introMessageExists" @click.native="createIntroMessage()").Headline add an introduction
            template(v-else)
              h1.Headline A message to play when they first enter
              textarea(
                v-model="newIntroMessage"
                :placeholder="`e.g. Welcome to ${zone.Title}! Try saying \"Hello\"`"
                )
              .button-grid
                w-button(v-if="introMessageChanged")
                  | Save Changes
                w-button(
                  v-if="introMessageChanged"
                  @click.native="revertIntroMessage()"
                  )
                  | Cancel
                w-button(@click.native="removeIntroMessage()")
                  | Remove
          hr
          h1.Headline Actors say and do what you wish.
          w-button(large outline @click.native="$router.push({ name: 'ActorCreate', params: { zoneid: $route.params.id } })").Headline
            | create an actor
          .actor-wrap
            .actor-item(
              v-for="(actor, id) in $store.state.actorMap"
              :class=`{
                blank: !$store.state.zoneActors[$route.params.id] || !$store.state.zoneActors[$route.params.id][id]
              }`
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
import { PATCH_ACTION, TRIGGER_TYPES } from '@/const';

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
  watch: {
    '$route.params.id'(id) {
      let newIntroMessage = '';
      if (this.$store.state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone]) {
        newIntroMessage = this.$store.state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
      }
      this.newIntroMessage = newIntroMessage;
    }
  },
  data() {
    let newIntroMessage = '';
    if (this.$store.state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone]) {
      newIntroMessage = this.$store.state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
    }
    return {
      newIntroMessage
    };
  },
  computed: {
    actors() {
      return this.$store.state.actorMap;
    },
    zone() {
      return this.$store.state.zoneMap[this.$route.params.id];
    },
    introMessageExists() {
      return this.zone.Triggers[TRIGGER_TYPES.InitializeZone] && this.zone.Triggers[TRIGGER_TYPES.InitializeZone].PatchAction !== PATCH_ACTION.DELETE;
    },
    introMessageChanged() {
      return this.newIntroMessage !== this.zone.Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
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
    },
    createIntroMessage() {
      this.$store.dispatch('createIntroMessage', this.$route.params.id);
    },
    saveIntroMessage() {
      this.$store.dispatch('saveIntroMessage', { ZoneID: this.$route.param.id, message: this.newIntroMessage });
    },
    revertIntroMessage() {
      this.newIntroMessage = this.$store.state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
    },
    removeIntroMessage() {
      this.$store.dispatch('removeIntroMessage', this.$route.params.id);
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
.info-box {
  display: inline-flex;
  flex-direction: column;
  textarea {
    width: 100%;
  }
  > * {
    margin: 2pt 0;
  }
}
</style>
