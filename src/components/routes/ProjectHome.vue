<template>
  <grid id="RouteProjectHome" gutter>
    <sidebar></sidebar>
    <paper class="flex flex-column">
      <paper-text>
        <h1 class="Headline">{{ selectedProject.Title }}</h1>
      </paper-text>
      <div class="flex paper-body">
        <div class="Grid-cell settings-wrap" v-if="!nextStepsToPublish">
          <div class="settings-inner Paper-text flex flex-column">
            <div class="label-container">
              <label>
                App Category
                <multiselect
                v-model="selectedCategory"
                @close="updateCategory()"
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
            <div class="space" />
            <h2 class="publish-info" v-if="metadata.Status == PUBLISH_STATUS.NotPublished">Never before published!</h2>
            <h2 class="publish-info" v-if="metadata.Status == PUBLISH_STATUS.Published">Last time published: {{ lastTimePublished }}</h2>
            <h2 class="publish-info" v-if="metadata.Status == PUBLISH_STATUS.Publishing">Publishing project...</h2>
            <h2 class="publish-info" v-if="metadata.Status == PUBLISH_STATUS.Problem">Sorry, there was a problem publishing. Please contact support.</h2>
            <h2 class="publish-info" v-if="metadata.Status == PUBLISH_STATUS.UnderReview">Your app has been submitted is currently under review!</h2>
            <div class="problem-list" v-if="metadata.Status == PUBLISH_STATUS.Denied">
              <h2>After making adjustments, please resubmit.</h2>
              <div v-if="metadata.Review.Dialogues && metadata.Review.Dialogues.length">
                In the following {{problemWithTarget[metadata.Review.ProblemWith]}} snippet:
                <ul>
                  <li v-for="(dialogue, idx) of metadata.Review.Dialogues" :key="idx">
                    &bull; <span v-if="metadata.Review.ProblemWith == 0">{{ idx % 2 === 0 ? 'User can say' : 'Actor replies' }}: </span>
                    {{dialogue.map(d => `"${d}"`).join(', ')}}
                  </li>
                </ul>
                <br>
                There's the following problem(s):
                <ul v-for="problem of metadata.Review.MajorProblems" :key="problem">
                  <li>&bull; {{majorProblems[problem].title}}</li>
                  <li v-if="majorProblems[problem].help">&nbsp;&nbsp;&nbsp;<i>{{majorProblems[problem].help}}</i></li>
                </ul>
                <ul v-for="problem of metadata.Review.MinorProblems" :key="problem">
                  <li>&bull; {{minorProblems[problem].title}}</li>
                  <li v-if="minorProblems[problem].help">&nbsp;&nbsp;&nbsp;{{minorProblems[problem].help}}</li>
                </ul>
                <br>
                Please ensure your app follows all of our guidelines before resubmitting.
              </div>
            </div>
            <w-button
              :disabled="metadata.Status == PUBLISH_STATUS.Publishing"
              lightOutline="lightOutline" @click="publish()">
              <icon name="logo" width="32" height="32"></icon>
              Submit for review
            </w-button>
            <div>Publishing means your app will be available for other people to use.</div>
          </div>
        </div>
        <div v-else class="Grid-cell">
          <div class="Paper-text">
            <w-button
              :disabled="true"
              lightOutline="lightOutline">
              <icon name="logo" width="32" height="32"></icon>
              Submit for review
            </w-button>
            <h2>{{ nextStepsToPublish }}</h2>
          </div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; height: 100%" v-if="!nextStepsToPublish">
          <h2>Demo project</h2>
          <ConvoBox />
        </div>
      </div>
    </paper>
  </grid>
</template>

<script>
import ConvoBox from '@/components/ConvoBox';
import { mapState } from 'vuex';
import { MONTHS, PUBLISH_STATUS, TAGS, PROJECT_CATEGORIES } from '@/const';
export default {
  name: 'ProjectHome',
  components: {
    ConvoBox
  },
  methods: {
    publish() {
      this.$store.dispatch('project/publish');
    },
    updateCategory() {
      this.$store.dispatch('project/updateCategory', this.selectedCategory);
    },
    updateTags() {
      this.$store.dispatch('project/updateTags', this.selectedTags);
    }
  },
  data() {
    return {
      PROJECT_CATEGORIES,
      TAGS,
      selectedCategory: this.$store.state.project.selectedProject.Category || PROJECT_CATEGORIES[0],
      selectedTags: this.$store.state.project.selectedProject.Tags || [],
      problemWithTarget: [
        'conversation',
        'zone entry text'
      ],
      majorProblems: {
        0: {
          title: 'Sexually explicit'
        },
        1: {
          title: 'Child endangerment'
        },
        2: {
          title: 'Violence and dangerous activities'
        },
        3: {
          title: 'Bullying and harassment'
        },
        4: {
          title: 'Hate speech'
        },
        5: {
          title: 'Sensitive event'
        },
        6: {
          title: 'Gambling'
        },
        7: {
          title: 'Illegal activities'
        },
        8: {
          title: 'Recreational drugs'
        },
        9: {
          title: 'Health'
        },
        10: {
          title: 'Language'
        },
        11: {
          title: 'Mature content'
        }
      },
      minorProblems: {
        0: {
          title: 'Conversation hanging open',
          help: `The conversation should very clearly point the user in at least one direction.
          Please make sure the user always knows what they can say to continue the conversation!`
        }
      }
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

<style lang="scss" scoped>
hr {
  padding: 1rem;
  color: $purple;
}
.label-container {
  margin: 0.5rem 0;
  width: 100%;
}
.problem-list {
  font-size: 1rem;
}
.publish-info, .problem-list {
  margin-bottom: 2rem;
}
.paper-body {
  flex: 1;
  width: 100%;

  .settings-wrap, .settings-inner {
    flex: 1;
    height: 100%;
  }
}

.space {
  flex: 1;
}
</style>
