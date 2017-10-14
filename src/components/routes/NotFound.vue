<template lang="pug">
  grid(gutter)#RouteNotFound
    sidebar
    paper-text
      h1.Headline
        span.Headline--dark Oops!
      grid(gutter)
        span Can't find that. Sorry!
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
