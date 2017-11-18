<template>
  <grid gutter="gutter" id="RouteActorHome">
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">
          <span class="Headline--dark">{{ actor.Title }}</span>
        </h1>
        <form class="Form" @submit.prevent="create">
          <grid gutter="gutter">
            <div class="Grid-cell u-size2of3">
              <p class="u-colorTextDark">Where this actor appears:</p>
              <section class="u-marginT3">
                <h2 class="Text u-colorTextLite" v-if="!actor.zoneIDs || !actor.zoneIDs.length">{{ actor.Title }} hasn't appeared yet</h2>
                <h2 class="Text" v-else v-for="zoneID in actor.zoneIDs">{{ zones[zoneID].Title }}</h2>
              </section>
            </div>
          </grid>
          <grid gutter="gutter">
            <form class="Form" @submit.prevent="">
              <div class="Grid-cell u-size3of3">
                <w-button @click.native="$router.push({ name: 'ActorDialog', id: actor.ID })">View Conversations</w-button>
              </div>
            </form>
          </grid>
        </form>
      </paper-text>
    </paper>
  </grid>
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
      return this.$store.state.selectedEntity ? this.$store.state.actorMap[this.$store.state.selectedEntity.data.ID] : {};
    },

    zones() {
      return this.$store.state.zoneMap;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
