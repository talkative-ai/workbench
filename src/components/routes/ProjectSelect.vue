<template>
  <div id="RouteProjectSelect">
    <h1>Choose a game:</h1>
    <div
      @click="toggleSelected(project)"
      :class="`project ${selected.ID === project.ID ? 'selected' : ''}`"
      v-for="project in projects" :key="project.ID">
      {{ project.Title }}
    </div>
    <hr />
    <button
      @click="openProject()"
      v-if="selected"
      class="button no-outline"
      to="/project/create">
      Open Game
    </button>
    <router-link class="button no-outline preplus" to="/project/create">
      Create New Game
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'ProjectSelect',
  data () {
    return {
      selected: false
    }
  },
  computed: {
    projects () {
      return this.$store.state.projectsList
    }
  },
  methods: {
    toggleSelected (id) {
      if (this.selected === id) {
        this.selected = false
      } else {
        this.selected = id
      }
    },
    openProject () {
      this.$store.commit('set', { key: 'selectedProject', value: this.selected })
      this.$router.push({ name: 'ProjectHome' })
    }
  }
}
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
