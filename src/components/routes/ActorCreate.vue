<template>
  <grid gutter id="RouteActorCreate">
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">
          <span class="Headline--dark" v-if="zoneActors && !zoneActors.length">You don't have any actors yet.</span>
          <br/>Create a new actor:</h1>
        <form class="Form" @submit.prevent="create()">
          <grid gutter>
            <div class="Grid-cell u-size2of3">
              <label>Name (required):
                <input class="Headline u-colorTextDark" v-model="actor.Title" placeholder="What's their name?"
                />
              </label>
            </div>
            <div class="Grid-cell">
              <div class="u-textRight u-marginT4">
                <w-button large="large" :class="{
                    disabled: !actor.Title.length,
                    Headline: true
                  }">Create actor
                  <span class="u-arrowEast"></span>
                </w-button>
              </div>
            </div>
          </grid>
        </form>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ActorCreate',
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
      this.$store.dispatch('actors/createActor', this.actor);
    }
  }
};
</script>

<style lang="scss">

</style>
