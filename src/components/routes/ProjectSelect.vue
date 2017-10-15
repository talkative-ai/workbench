<template lang="pug">
  #RouteProjectSelect
    h1 Choose a project:
    div(
      @click='toggleSelected(project)'
      :class="`project ${selected.ID === project.ID ? 'selected' : ''}`"
      v-for='project in projects'
      :key='project.ID'
    )
      | {{ project.Title }}
    hr
    .button-grid
      w-button.no-outline(@click.native='openProject()' v-if='selected' to='/project/create')
        | Open
      w-button.no-outline(@click.native='createProject()')
        | Create New
</template>

<script>
import WButton from '../elements/Button';
export default {
  name: 'ProjectSelect',
  components: {
    WButton
  },
  data() {
    return {
      selected: false
    };
  },
  computed: {
    projects() {
      return this.$store.state.projectsList;
    }
  },
  methods: {
    toggleSelected(id) {
      if (this.selected === id) {
        this.selected = false;
      } else {
        this.selected = id;
      }
    },
    openProject() {
      this.$store.dispatch('selectProject', this.selected);
    },

    createProject() {
      this.$router.push({ name: 'ProjectCreate' });
    }
  }
};
</script>

<style lang="scss" scoped>
.project {
  color: $purple;
  width: 50%;
  font-size: 2rem;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(0,0,0,0);
}

h1 {
  padding: 1rem;
}

.selected {
  border: 1px solid $purple;
  padding: 0.5rem 1rem;
}

hr {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  margin-top: 4rem;
}
</style>
