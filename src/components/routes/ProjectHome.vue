<template>
  <grid id="RouteProjectHome" gutter>
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">Dashboard</h1>
        <w-button lightOutline="lightOutline" @click.native="publish()">
          <icon name="logo" width="32" height="32"></icon>
          Publish to the Multiverse
        </w-button>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
export default {
  name: 'ProjectHome',
  methods: {
    publish() {
      this.$store.dispatch('project/publish');
    }
  }
};
</script>

<style lang="scss">

</style>
