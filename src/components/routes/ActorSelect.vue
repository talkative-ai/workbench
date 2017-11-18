<template lang="pug">
  <grid gutter="gutter" id="RouteActorSelect">
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">
          <span class="Headline--dark">Select an actor</span>
        </h1>
        <grid gutter="gutter">
          <span>Hello</span>
        </grid>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import WButton from '../elements/Button';
import Grid from '../elements/Grid';
import Sidebar from '../Sidebar';
import Paper from '../Paper';
import PaperText from '../elements/PaperText';

export default {
  name: 'ActorSelect',
  props: ['zoneid'],
  components: {
    WButton,
    Sidebar,
    Grid,
    PaperText,
    Paper
  },
  methods: {
  }
};
</script>

<style lang="scss">

</style>
