<template>
  <grid gutter id="RouteActorCreate">
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">
          Actors carry conversations.
          <br/>Name your actor:
        </h1>
        <form class="Form u-flex" @submit.prevent="create()">
          <input
            v-validate="{ required: true, regex: /^[\w|\s]*$/, min: 1, max: 50 }"
            class="Headline u-size1of2 u-marginR3"
            v-model="actor.Title"
            placeholder="Enter name"
            required="required" />
          <div class="Headline">
            <w-button :disabled="errors.any()">Enter
              <span class="u-arrowEast"></span>
            </w-button>
          </div>
        </form>
        <div class="input-hint">
          <ul>
            <li>Length between 1 and 50.</li>
            <li>Only letters, numbers, and spaces.</li>
          </ul>
        </div>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ActorCreate',
  mounted() {
    this.$validator.validateAll();
  },
  props: ['zoneid'],
  data() {
    return {
      actor: {
        Title: ''
      }
    };
  },
  computed: {
    ...mapState('zones', {
      zoneActors(state) {
        return state.zoneActors[this.zoneid];
      }
    })
  },
  methods: {
    create() {
      if (this.zoneid) {
        this.actor.ZoneID = this.zoneid;
      }
      this.$store.dispatch('actors/createActor', this.actor)
      .then(() => {
        this.$router.push({ name: 'ZoneHome', params: { id: this.zoneid } });
      });
    }
  }
};
</script>

<style lang="scss">

</style>
