<template lang="pug">
  grid#RouteZoneCreate(gutter)
    sidebar
    paper
      paper-text(full)
        h1.Headline
          span.Headline--hilite Everything happens in a Zone.
          br
          | Name this Zone:
        form.Form
          input.Headline.u-size1of2.u-marginR3(v-model="zone.Title")
          w-button.Headline(
            @click="create"
            :class="`u-bgColorBrand ${!zone.Title.length ? 'hidden' : ''}`"
          )
            | Enter
            span.u-arrowEast
</template>

<script>
import Grid from '../elements/Grid'
import WButton from '../elements/Button'
import PaperText from '../elements/PaperText'
import Sidebar from '../Sidebar'
import Paper from '../Paper'

export default {
  name: 'ZoneCreate',
  components: {
    Sidebar,
    WButton,
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


</style>
