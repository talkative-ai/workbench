<template>
  <grid gutter id="RouteZoneHome">
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">
          <span class="Headline--dark">You're in the zone.</span>
        </h1>
      </paper-text>
      <div class="Grid-cell">
        <div class="Paper-text">
          <div class="info-box">
            <w-button class="Headline" large="large" outline="outline" v-if="!introMessageExists" @click.native="createIntroMessage()">add an introduction</w-button>
            <template v-else>
              <h1 class="Headline">A message to play when they first enter</h1>
              <textarea v-model="newIntroMessage" :placeholder="`e.g. Welcome to ${zone.Title}! Try saying &quot;Hello&quot;`"></textarea>
              <div class="button-grid">
                <w-button v-if="introMessageChanged && newIntroMessage" @click.native="saveIntroMessage()">Save Changes</w-button>
                <w-button v-if="introMessageChanged" @click.native="revertIntroMessage()">Cancel</w-button>
                <w-button @click.native="removeIntroMessage()">Remove</w-button>
              </div>
            </template>
          </div>
          <hr>
          <h1 class="Headline">Actors say and do what you wish.</h1>
          <w-button class="Headline" large="large" outline="outline" @click.native="$router.push({ name: 'ActorCreate', params: { zoneid: $route.params.id } })">create an actor</w-button>
          <div class="actor-wrap">
            <div class="actor-item" v-for="(actor, id) in actors" :class="{
                blank: !zoneActors || !zoneActors[id]
              }" :key="id">
              <h1 class="Headline">{{ actors[id].Title }}</h1>
              <div class="button-grid">
                <w-button class="add-button" v-if="!zoneActors || !zoneActors[id]"
                  @click.native="addActor(id)">
                  <fa-icon name="plus"></fa-icon>Add</w-button>
                <w-button outline="outline" v-if="zoneActors && zoneActors[id]"
                  @click.native="removeActor(id)">
                  <fa-icon name="times"></fa-icon>Remove</w-button>
                <w-button @click.native="selectActor(id)">
                  <fa-icon name="pencil"></fa-icon>Edit</w-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </paper>
  </grid>
</template>

<script>
import { PATCH_ACTION, TRIGGER_TYPES } from '@/const';
import { mapState } from 'vuex';

export default {
  name: 'ZoneHome',
  watch: {
    '$route.params.id'(id) {
      let newIntroMessage = '';
      if (this.$store.state.zones.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone]) {
        newIntroMessage = this.$store.state.zones.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
      }
      this.newIntroMessage = newIntroMessage;
    }
  },
  data() {
    let newIntroMessage = '';
    if (this.$store.state.zones.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone]) {
      newIntroMessage = this.$store.state.zones.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
    }
    return {
      newIntroMessage
    };
  },
  computed: {
    ...mapState('actors', {
      actors: 'actorMap'
    }),
    ...mapState('zones', {
      zone(state) {
        return state.zoneMap[this.$route.params.id];
      },
      zoneActors(state) {
        return state.zoneActors[this.$route.params.id];
      },
      introMessageExists(state) {
        return state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone] &&
        state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].PatchAction !== PATCH_ACTION.DELETE;
      },
      introMessageChanged(state) {
        return this.newIntroMessage !== state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
      }
    })
  },
  methods: {
    selectActor(ID) {
      this.$store.dispatch('actors/selectActor', ID)
      .then(() => {
        this.$router.push({ name: 'ActorHome', params: { id: ID } });
      });
    },
    removeActor(ID) {
      this.$store.dispatch('zones/removeActorFromZone', { ActorID: ID, ZoneID: this.$route.params.id });
    },
    addActor(ID) {
      this.$store.dispatch('zones/addActorToZone', { ActorID: ID, ZoneID: this.$route.params.id });
    },
    createIntroMessage() {
      this.$store.dispatch('zones/createIntroMessage', this.$route.params.id);
    },
    saveIntroMessage() {
      this.$store.dispatch('zones/saveIntroMessage', { ZoneID: this.$route.params.id, message: this.newIntroMessage });
    },
    revertIntroMessage() {
      this.newIntroMessage = this.$store.state.zones.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
    },
    removeIntroMessage() {
      this.$store.dispatch('zones/removeIntroMessage', this.$route.params.id);
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
