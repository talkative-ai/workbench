<template>
  <grid id="RouteProjectHome" gutter>
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">{{ selectedProject.Title }}</h1>
      </paper-text>
      <div class="Grid-cell" v-if="!nextStepsToPublish">
        <div class="Paper-text">
          <div class="label-container">
            <label>
              App Category
              <multiselect
              v-model="selectedCategory"
              @select="updateCategory($event)"
              :close-on-select="false"
              :options="PROJECT_CATEGORIES" />
            </label>
          </div>
          <div class="label-container">
            <label>
              App Tags
              <multiselect
              v-model="selectedTags"
              :multiple="true"
              :max="3"
              @close="updateTags($event)"
              @remove="updateTags($event)"
              :close-on-select="false"
              :options="TAGS" />
            </label>
          </div>
          <hr>
          <w-button
            :disabled="metadata.Status == PUBLISH_STATUS.Publishing"
            lightOutline="lightOutline" @click.native="publish()">
            <icon name="logo" width="32" height="32"></icon>
            Publish to the Multiverse
          </w-button>
          <div>Publishing to the Multiverse means your app will be available on the Google home.</div>
          <hr>
          <h2 v-if="metadata.Status == PUBLISH_STATUS.NotPublished">Never before published!</h2>
          <h2 v-if="metadata.Status == PUBLISH_STATUS.Published">Last time published: {{ lastTimePublished }}</h2>
          <h2 v-if="metadata.Status == PUBLISH_STATUS.Publishing">Publishing project...</h2>
          <h2 v-if="metadata.Status == PUBLISH_STATUS.Problem">Sorry, there was a problem publishing. Please contact support.</h2>
          <h2 v-if="metadata.Status == PUBLISH_STATUS.UnderReview">Your app has been submitted is currently under review!</h2>
          <h2 v-if="metadata.Status == PUBLISH_STATUS.Denied">Your app has been denied.</h2>
        </div>
      </div>
      <div v-else class="Grid-cell">
        <div class="Paper-text">
          <w-button
            :disabled="true"
            lightOutline="lightOutline">
            <icon name="logo" width="32" height="32"></icon>
            Publish to the Multiverse
          </w-button>
          <h2>{{ nextStepsToPublish }}</h2>
        </div>
      </div>
    </paper>
  </grid>
</template>

<script>
import { mapState } from 'vuex';
import { MONTHS, PUBLISH_STATUS, TAGS, PROJECT_CATEGORIES } from '@/const';
export default {
  name: 'ProjectHome',
  methods: {
    publish() {
      this.$store.dispatch('project/publish');
    },
    updateCategory() {
      console.log('hi');
    },
    updateTags() {
      console.log();
    }
  },
  data() {
    return {
      PROJECT_CATEGORIES,
      TAGS,
      selectedCategory: null,
      selectedTags: []
    };
  },
  computed: {
    ...mapState('zones', {
      zoneActors: 'zoneActors'
    }),
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
    },
    nextStepsToPublish() {
      if (!this.selectedProject.Zones.length) {
        return 'In order to publish, create a Zone, add an Actor, and create some conversations!';
      }
      if (!this.selectedProject.Actors.length || !Object.keys(this.zoneActors[this.selectedProject.StartZoneID] || {})
        .find(actorKey => this.zoneActors[this.selectedProject.StartZoneID][actorKey])) {
        return 'In order to publish, add an Actor to the Start Zone, and create some conversations!';
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('project/cancelCheckStatus');
    next();
  }
};
</script>

<style lang="scss">
hr {
  padding: 1rem;
  color: $purple;
}
.label-container {
  margin: 0.5rem 0;
}
</style>
