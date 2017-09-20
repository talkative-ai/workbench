<template lang="pug">
  grid#RouteZoneCreate(gutter)
    sidebar
    paper
      paper-text
        h1.Headline Everything happens in a Zone.
        h2.Headline Name this Zone:
        .u-flex
          input(v-model="zone.Title")
          button(
            @click="create"
            :class="`button no-outline ${!zone.Title.length ? 'hidden' : ''}`"
          )
            | Enter
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
#RouteZoneCreate,
input {
  color: white;
}

#RouteZoneCreate {
  display: flex;
}
</style>
