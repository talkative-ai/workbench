<template>
  <grid gutter id="RouteActorHome">
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">
          <span class="Headline--dark">{{ actor.Title }}</span>
        </h1>
        <form class="Form" @submit.prevent="create">
          <grid gutter>
            <div class="Grid-cell u-size2of3">
              <p class="u-colorTextDark">Where this actor appears:</p>
              <section class="u-marginT3">
                <h2 class="Text u-colorTextLite" v-if="!isActorInZone">{{ actor.Title }} hasn't appeared yet</h2>
                <template v-for="(exists, zoneID) in actor.zoneIDs" v-if="exists">
                  <h2 class="Text" :key="zoneID">{{ zones[zoneID].Title }}</h2>
                </template>
              </section>
            </div>
          </grid>
          <grid gutter>
            <form class="Form" @submit.prevent>
              <div class="Grid-cell u-size3of3">
                <w-button @click="$router.push({ name: 'ActorDialog', id: actor.ID })">View Conversations</w-button>
              </div>
            </form>
          </grid>
        </form>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'ActorHome',
  computed: {
    ...mapGetters('actors', {
      actor: 'currentActor'
    }),
    ...mapState('zones', {
      zones: 'zoneMap'
    }),
    isActorInZone() {
      return this.actor.zoneIDs && Object.keys(this.actor.zoneIDs).length;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
