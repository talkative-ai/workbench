<template>
  <grid gutter id="RouteProjectCreate">
    <paper>
      <paper-text>
        <h1 class="Headline">
          <span class="Headline--dark">Name your project:</span>
        </h1>
        <form class="Form" @submit.prevent="createProject()" :disabled="isDisabled()">
          <input class="Headline u-size1of2 u-marginR3" placeholder="Add name" v-model="project.Title" required="required" />
          <div class="error" v-if="createError">{{ createError }}</div>
          <div class="input-hint">Must be 3 - 255 characters long, with no special characters like !@#$%^&*()
            <br/>You can change this later. Other people will see this name when you publish!</div>
          <br/>
          <w-button outline="outline">Begin
            <span class="u-arrowEast"></span>
          </w-button>
          <w-button outline="outline" @click.native="$router.push({ name: 'ProjectHome' })">Cancel
            <span class="u-arrowEast"></span>
          </w-button>
        </form>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import Button from '../elements/Button';
import Grid from '../elements/Grid';
import PaperText from '../elements/PaperText';
import Sidebar from '../Sidebar';
import Paper from '../Paper';

export default {
  name: 'ProjectCreate',
  components: {
    'w-button': Button,
    Grid,
    PaperText,
    Sidebar,
    Paper
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
      this.$store.dispatch('createProject', this.project)
      .catch(err => {
        switch (err.message) {
          case 'project_exists':
            this.createError = `A project with the title "${this.project.Title}" already exists.`;
            break;
          case 'project_limit_reached':
            this.createError = `You have reached your limit of projects.`;
            break;
        }
      })
      .then(() => {
        this.creating = false;
      });
    },
    isDisabled() {
      if (this.creating) return true;

      if (this.project.Title.length < 3) {
        return true;
      }
      const illegalChars = new RegExp('[!$\\#%^&*()_+|~=`{}\\[\\]:";\'<>?\\/]');
      if (illegalChars.exec(this.project.Title)) {
        return true;
      }
    }
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
  color: $light-grey;
  i {
    display: block;
  }
}

.bottom-container {
  text-align: right;
  padding-right: 10%;
}
</style>
