<template lang="pug">
  grid(gutter)#RouteActorSelect
    sidebar
    paper
      paper-text
        h1.Headline
          span.Headline--dark Select an actor
        grid(gutter)
          span Hello
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
