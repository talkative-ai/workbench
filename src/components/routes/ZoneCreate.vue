<template>
  <grid gutter id="RouteZoneCreate">
    <Sidebar />
    <PaperWorkspace>
      <CanvasText>
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
      </CanvasText>
    </PaperWorkspace>
  </grid>
</template>

<script>
import Grid from '../elements/Grid'
import CanvasText from '../elements/CanvasText'
import Sidebar from '../Sidebar'
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'ZoneCreate',
  components: {
    Sidebar,
    Grid,
    CanvasText,
    PaperWorkspace
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
