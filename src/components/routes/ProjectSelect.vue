<template>
  <grid gutter id="RouteProjectSelect">
    <column menu="menu">&nbsp;</column>
    <paper>
      <paper-text>
        <h1>Choose a project:</h1>
        <div @click="openProject(project)" class="project" v-for="project in projects" :key="project.ID">{{ project.Title }}</div>
        <hr>
        <div class="button-grid">
          <w-button class="no-outline" @click="openProject()" v-if="selected" to="/project/create">Open</w-button>
          <w-button class="no-outline" @click="createProject()">Create New</w-button>
        </div>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/store';
import router from '@/router';

export default {
  data() {
    return {
      selected: false
    };
  },
  computed: {
    ...mapState('master', {
      projects: 'projectsList'
    })
  },
  methods: {
    toggleSelected(id) {
      if (this.selected === id) {
        this.selected = false;
      } else {
        this.selected = id;
      }
    },
    openProject(projectID) {
      this.$store.dispatch('project/selectProject', projectID).then(() => {
        this.$router.push({ name: 'ProjectHome' });
      });
    },

    createProject() {
      this.$router.push({ name: 'ProjectCreate' });
    }
  },
  beforeCreate() {
    store.dispatch('resetState', { keepAuth: true });
    return store.dispatch('master/getProjects')
    .then(result => {
      store.commit('master/projectsList', result);
      if (!result.length) {
        router.push({ name: 'ProjectCreate' });
      }
    });
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
</style>
