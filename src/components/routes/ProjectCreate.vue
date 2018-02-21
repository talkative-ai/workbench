<template>
  <grid gutter id="RouteProjectCreate">
    <column menu="menu">&nbsp;</column>
    <paper>
      <paper-text>
        <h1 class="Headline">
          <span class="Headline--dark">Name your project:</span>
        </h1>
        <form
          class="Form u-flex"
          @submit.prevent="createProject()"
          :disabled="isDisabled()">
          <div class="Headline u-size1of3 u-marginR3">
            <input
              @keydown="updateTitle()"
              v-validate="'required|alpha_spaces|min:3|max:50'"
              class="Headline u-marginR3"
              name="title"
              placeholder="Add name" v-model="project.Title" required="required" />
            <div class="error" v-if="createError">{{ createError }}</div>
            <div class="input-hint" v-else>
              <ul>
                <li>Length between 3 and 50</li>
                <li>Only letters and spaces</li>
              </ul>
              <br>
              Other people will see this name when you publish!
            </div>
          </div>
          <div class="Headline">
            <w-button :disabled="errors.any()">
              Begin
              <span class="u-arrowEast"></span>
            </w-button>
          </div>
        </form>
        <template v-if="projectsList.length">
          <hr>
          <div>
            <w-button @click="$router.push({ name: 'ProjectHome' })">
              Cancel
            </w-button>
          </div>
        </template>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'ProjectCreate',
  mounted() {
    this.$validator.validateAll();
  },
  data() {
    return {
      project: {
        Title: ''
      },
      creating: false,
      createError: null
    };
  },
  methods: {
    createProject() {
      this.creating = true;
      this.$store.dispatch('project/createProject', this.project)
      .then(pid => {
        this.creating = false;
        this.$router.push({ name: 'ProjectHome' });
      })
      .catch(async err => {
        err = await err.json();
        switch (err.message) {
          case 'project_exists':
            this.createError = `A project with the title "${this.project.Title}" already exists.`;
            break;
          case 'project_limit_reached':
            this.createError = `You have reached your limit of projects.`;
            break;
        }
        this.creating = false;
      });
    },
    isDisabled() {
      if (this.creating) return true;

      if (this.project.Title.length < 3) {
        return true;
      }
      const illegalChars = new RegExp('[^\\w\\s!]');
      if (illegalChars.exec(this.project.Title)) {
        return true;
      }
    },
    updateTitle() {
      this.createError = null;
    }
  },
  computed: {
    ...mapState('master', {
      projectsList: 'projectsList'
    })
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  margin: 15% 0;
}

.error {
  color: red;
  font-weight: bold;
  font-size: 1.4rem;
  margin: 1rem 0;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 100;
}

h1 {
  color: $light-grey;
  font-size: 2.5rem;
  margin: 0pt;
}

h2 {
  font-size: 2.6rem;
}

h2, h3 {
  color: $purple;
  margin: 0pt;
  margin: 0;
}

h3 {
  color: $light-grey;
}

.input-hint {
  font-size: 0.9rem;
  color: $light-grey;
  margin: 1rem 0;
  i {
    display: block;
  }
}

.bottom-container {
  text-align: right;
  padding-right: 10%;
}
</style>
