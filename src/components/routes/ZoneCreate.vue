<template lang="pug">
  #RouteZoneCreate
    sidebar
    .main-container
      h1 Everything happens in a Zone.
      h2 Name this Zone:
      .flex
        input(v-model='zone.Title')
        button(@click='create', :class="`button no-outline ${!zone.Title.length ? 'hidden' : ''}`")
          | Enter
</template>

<script>
import Sidebar from '../Sidebar.vue'
export default {
  name: 'ZoneCreate',
  components: {
    Sidebar
  },
  data () {
    return {
      zone: {
        Title: ''
      }
    }
  },
  methods: {
    create () {
      let zone
      this.$store.dispatch('createZone', this.zone)
      .then(z => {
        zone = z
        return this.$store.dispatch('selectZone', zone.ID)
      })
      .then(() => {
        this.$router.replace({ name: 'ZoneHome', params: { id: zone.ID } })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#RouteZoneCreate, input {
  color: white;
}

#RouteZoneCreate {
  display: flex;
}

h1 {
  color: $lighter-grey;
}

h1, h2 {
  font-weight: 100;
  margin: 0;
  font-size: 2rem;
}

.main-container {
  padding: 5%;
  width: 100%;
}

</style>
