<template lang="pug">
  grid(gutter)#RouteProjectCreate
    paper
      paper-text
        h1.Headline 
          span.Headline--dark Imagine a place, and...
          br
          | Name your game:
        
        form.Form(@submit.prevent="createProject()")
          input.Headline.u-size1of2.u-marginR3(placeholder="Add name", v-model="projectName", required)
          .input-hint
            | Must be 3 - 255 characters long, with no special characters like !@#$%^&*()
            br
            | You can change this later. Other people will see this name when you publish!
          br
          w-button(outline @click.native="createProject()", :disabled="isDisabled()")
            | Begin
            span.u-arrowEast
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
      projectName: '',
      creating: false
    };
  },
  methods: {
    createProject() {
      this.creating = true;
      this.$store.dispatch('createProject', this.actor);
    },
    isDisabled() {
      if (this.projectName.length < 3) {
        return true;
      }
      const illegalChars = new RegExp('[!$\\#%^&*()_+|~=`{}\\[\\]:";\'<>?\\/]');
      if (illegalChars.exec(this.projectName)) {
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
