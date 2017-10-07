<template lang="pug">
  #RouteProjectSelect
    h1 Choose a game:
    div(
      @click='toggleSelected(project)'
      :class="`project ${selected.ID === project.ID ? 'selected' : ''}`"
      v-for='project in projects'
      :key='project.ID'
    )
      | {{ project.Title }}
    hr
    button.button.no-outline(@click='openProject()' v-if='selected' to='/project/create')
      | Open Game
    buttin.button.no-outline.preplus(@click='createProject()')
      | Create New Game
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
      this.$store.dispatch('selectProject', this.selected)
      .then(() => {
        this.$router.push({ name: 'ProjectHome' })
      })
    },

    createProject () {
      this.$router.push({ name: 'ProjectCreate' })
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
