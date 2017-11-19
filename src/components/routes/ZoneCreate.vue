<template>
  <grid id="RouteZoneCreate" gutter>
    <sidebar></sidebar>
    <paper>
      <paper-text full="full">
        <h1 class="Headline">
          <span class="Headline">Everything happens in a Zone.</span>
          <br/>Name your new Zone:</h1>
        <form class="Form u-flex" @submit.prevent="create()">
          <input class="Headline u-size1of2 u-marginR3" v-model="zone.Title" placeholder="Enter name" required="required" />
          <div class="Headline">
            <w-button :class="{
                hidden: !zone.Title.length
              }">Enter
              <span class="u-arrowEast"></span>
            </w-button>
          </div>
        </form>
      </paper-text>
    </paper>
  </grid>
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
      this.$store.dispatch('zones/createZone', this.zone)
      .then(z => {
        zone = z;
        return this.$store.dispatch('zones/selectZone', zone.ID);
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
