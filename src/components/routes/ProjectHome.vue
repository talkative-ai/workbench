<template lang="pug">
  grid#RouteProjectHome(gutter)
    sidebar
    paper
      paper-text
        h1.Headline Dashboard
</template>

<script>
import Grid from '../elements/Grid';
import Sidebar from '../Sidebar';
import Paper from '../Paper';
import PaperText from '../elements/PaperText';

export default {
  name: 'ProjectHome',
  components: {
    Grid,
    Sidebar,
    Paper,
    PaperText
  }
};
</script>

<style lang="scss">

</style>
