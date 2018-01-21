<template>
  <grid id="RouteZoneCreate" gutter>
    <sidebar></sidebar>
    <paper>
      <paper-text full="full">
        <h1 class="Headline">
          <span class="Headline">Everything happens in a zone.</span>
          <br/>Name your new zone:</h1>
        <form class="Form u-flex" @submit.prevent="create()">
          <input
            v-validate="{ required: true, regex: /^[\w|\s]*$/, min: 1, max: 50 }"
            class="Headline u-size1of2 u-marginR3"
            v-model="zone.Title"
            placeholder="Enter name"
            required="required" />
          <div class="Headline">
            <w-button :disabled="errors.any()">Enter
              <span class="u-arrowEast"></span>
            </w-button>
          </div>
        </form>
        <div class="input-hint">
          <ul>
            <li>Length between 1 and 50.</li>
            <li>Only letters, numbers, and spaces.</li>
          </ul>
        </div>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
export default {
  name: 'ZoneCreate',
  mounted() {
    this.$validator.validateAll();
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
