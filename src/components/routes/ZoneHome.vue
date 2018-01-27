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
              <form class="Form" @submit.prevent>
                <textarea
                  v-autosize="newIntroMessage"
                  v-model="newIntroMessage" :placeholder="`e.g. Welcome to ${zone.Title}! Try saying &quot;Hello&quot;`" />
                <div class="button-grid">
                  <w-button v-if="introMessageChanged && newIntroMessage" @click.native="saveIntroMessage()">Save Changes</w-button>
                  <w-button v-if="introMessageChanged" @click.native="revertIntroMessage()">Cancel</w-button>
                  <w-button @click.native="removeIntroMessage()">Remove</w-button>
                </div>
              </form>
            </template>
          </div>
          <label>
            <input type="radio" :checked="selectedProject.StartZoneID === zone.ID" @change="setStartZone">This is the zone the player starts in
          </label>
          <hr>
          <h1 class="Headline">Actors say and do what you wish.</h1>
          <w-button class="Headline" large="large" outline="outline" @click.native="$router.push({ name: 'ActorCreate', params: { zoneid: $route.params.id } })">create an actor</w-button>
          <div class="actor-wrap">
            <ZoneActorItem v-for="(actor, id) in actors"
              :key="id"
              :actor="actor"
              :zoneActors="zoneActors"
              :zoneID="$route.params.id" />
          </div>
        </div>
      </div>
    </paper>
  </grid>
</template>

<script>
import { PATCH_ACTION, TRIGGER_TYPES } from '@/const';
import { mapState } from 'vuex';
import ZoneActorItem from '@/components/ZoneActorItem';

export default {
  name: 'ZoneHome',
  components: {
    ZoneActorItem
  },
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
        return state.zoneMap[this.$route.params.id].Triggers &&
        state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone] &&
        state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].PatchAction !== PATCH_ACTION.DELETE;
      },
      introMessageChanged(state) {
        return this.newIntroMessage !== state.zoneMap[this.$route.params.id].Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
      }
    }),
    ...mapState('project', {
      selectedProject: 'selectedProject'
    })
  },
  methods: {
    createIntroMessage() {
      this.$store.dispatch('zones/createIntroMessage', this.zone.ID);
    },
    saveIntroMessage() {
      this.$store.dispatch('zones/saveIntroMessage', { ZoneID: this.zone.ID, message: this.newIntroMessage });
    },
    revertIntroMessage() {
      this.newIntroMessage = this.zone.Triggers[TRIGGER_TYPES.InitializeZone].AlwaysExec.PlaySounds[0].Val;
    },
    removeIntroMessage() {
      this.newIntroMessage = '';
      this.$store.dispatch('zones/removeIntroMessage', this.zone.ID);
    },
    setStartZone() {
      this.$store.dispatch('project/startZone', this.zone.ID);
    }
  }
};
</script>

<style lang="scss" scoped>
hr {
  margin: 10pt 0;
}
label {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  padding: 10pt;
  border: 1pt solid black;
  input {
    margin-right: 10pt;
  }
}
.actor-wrap {
  display: flex;
  flex-wrap: wrap;
  div {
    margin: 10pt 20pt 10pt 0;
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
