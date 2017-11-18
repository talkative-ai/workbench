<template>
  <grid gutter="gutter" id="RouteNotFound">
    <sidebar></sidebar>
    <paper-text>
      <h1 class="Headline">
        <span class="Headline--dark">Oops!</span>
      </h1>
      <grid gutter="gutter">
        <span>Can't find that. Sorry!</span>
      </grid>
    </paper-text>
  </grid>
</template>

<script>
import WButton from '../elements/Button';
import Grid from '../elements/Grid';
import Sidebar from '../Sidebar';
import Paper from '../Paper';
import PaperText from '../elements/PaperText';

export default {
  name: 'NotFound',
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
