<template>
  <grid gutter id="RouteZoneCreate">
    <sidebar />
    <paper>
      <paper-text>
        <h1 class="Headline">Everything happens in a Zone.</h1>
        <h2 class="Headline">Name this Zone:</h2>
        <div class="u-flex">
          <input v-model="zone.Title" />
          <button
            @click="create"
            :class="`button no-outline ${!zone.Title.length ? 'hidden' : ''}`">
            Enter
          </button>
        </div>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import Grid from '../elements/Grid'
import PaperText from '../elements/PaperText'
import Sidebar from '../Sidebar'
import Paper from '../Paper'

export default {
  name: 'ZoneCreate',
  components: {
    Sidebar,
    Grid,
    PaperText,
    Paper
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
      this.$store.dispatch('createZone', this.zone)
      .then(zone => {
        this.$router.replace({ name: 'ZoneHome', params: { id: zone.ID } })
      })
    }
  }
}
</script>



<style lang="scss" scoped>
#RouteZoneCreate,
input {
  color: white;
}

#RouteZoneCreate {
  display: flex;
}
</style>
