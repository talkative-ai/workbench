<template>
  <grid id="RouteProjectHome" gutter>
    <sidebar></sidebar>
    <paper>
      <paper-text>
        <h1 class="Headline">Dashboard</h1>
      </paper-text>
    </paper>
  </grid>
</template>

<script>
import Grid from '../elements/Grid';
import Sidebar from '../Sidebar';
import Paper from '../Paper';
import PaperText from '../elements/PaperText';
import Preview from '../Preview';

export default {
  name: 'ProjectHome',
  components: {
    Grid,
    Sidebar,
    Paper,
    PaperText,
    Preview
  }
};
</script>

<style lang="scss">

</style>
