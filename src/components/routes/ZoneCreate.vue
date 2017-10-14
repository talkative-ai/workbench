<template lang="pug">
  grid#RouteZoneCreate(gutter)
    sidebar
    paper
      paper-text(full)
        h1.Headline
          span.Headline--dark Everything happens in a Zone.
          br
          | Name your new Zone:
        form.Form.u-flex(@submit.prevent="create()")
          input.Headline.u-size1of2.u-marginR3(v-model="zone.Title", placeholder="Add name", required)
          .Headline.u-colorWhite
            w-button(
              lightOutline
              :class="`${!zone.Title.length ? 'hidden' : ''}`"
            )
              | Enter
              span.u-arrowEast
</template>

<script>
import Grid from '../elements/Grid';
import Button from '../elements/Button';
import PaperText from '../elements/PaperText';
import Sidebar from '../Sidebar';
import Paper from '../Paper';

export default {
  name: 'ZoneCreate',
  components: {
    Sidebar,
    'w-button': Button,
    Grid,
    PaperText,
    Paper
  },
  data() {
    return {
      zone: {
        Title: ''
      }
    };
  },
  methods: {
    create() {
      let zone;
      this.$store.dispatch('createZone', this.zone)
      .then(z => {
        zone = z;
        return this.$store.dispatch('selectZone', zone.ID);
      })
      .then(() => {
        this.$router.replace({ name: 'ZoneHome', params: { id: zone.ID } });
      });
    }
  }
};
</script>



<style scoped>


</style>
