<template>
  <grid id="RouteProjectHome" gutter>
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">{{ selectedProject.Title }}</h1>
      </paper-text>
      <div class="Grid-cell">
        <div class="Paper-text">
          <w-button lightOutline="lightOutline" @click.native="publish()">
            <icon name="logo" width="32" height="32"></icon>
            Publish to the Multiverse
          </w-button>
          <h2 v-if="metadata.Status == PUBLISH_STATUS.Published">Last time published: {{ lastTimePublished }}</h2>
          <h2 v-if="metadata.Status == PUBLISH_STATUS.Publishing">Publishing project...</h2>
        </div>
      </div>
    </paper>
  </grid>
</template>

<script>
import { mapState } from 'vuex';
import { MONTHS, PUBLISH_STATUS } from '@/const';
export default {
  name: 'ProjectHome',
  methods: {
    publish() {
      this.$store.dispatch('project/publish');
    }
  },
  computed: {
    ...mapState('project', {
      selectedProject: 'selectedProject',
      metadata: 'metadata'
    }),
    lastTimePublished() {
      let d = new Date(this.metadata.PublishTime);
      let ampm = 'a.m.';
      let hours = d.getHours();
      if (hours > 12) {
        ampm = 'p.m.';
        hours -= 12;
      }
      let minutes = d.getMinutes();
      if (minutes < 10) minutes = `0${minutes}`;
      return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} @ ${hours}:${minutes} ${ampm}`;
    },
    PUBLISH_STATUS() {
      return PUBLISH_STATUS;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('project/cancelCheckStatus');
    next();
  }
};
</script>

<style lang="scss">

</style>
