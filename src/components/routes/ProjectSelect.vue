<template>
  <div id="RouteProjectSelect">
    <h1>Choose a game:</h1>
    <div v-for="project in projects" :key="project.ID">
      <h2>{{ project.Title }}</h2>
    </div>
    <hr />
    <button>Create new game</button>
  </div>
</template>

<script>
export default {
  name: 'ProjectSelect',
  computed: {
    projects () {
      return this.$store.state.projectsList
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  color: $purple;
}
</style>
