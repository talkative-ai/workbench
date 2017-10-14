<template lang="pug">
  grid(gutter)#RouteSignIn
    column(menu)
      | &nbsp;
    paper
      paper-text
        //- w-button.Headline(
        g-signin-button(
          class="Headline Button large"
          :params="googleSignInParams"
          @success="onSignInSuccess"
          @error="onSignInError"
        )
          | Sign in with Google
        p.u-marginT3.u-colorTextLight
          | Currently only sign in with Google is supported.
</template>


<script>
import WButton from '../elements/Button';
import Grid from '../elements/Grid';
import Column from '../elements/Column';
import PaperText from '../elements/PaperText';
import Paper from '../Paper';

export default {
  name: 'SignIn',
  data() {
    return {
      googleSignInParams: {
        client_id: '693388894852-2s2q0ggfj09c5mq094gpdbppugce944m.apps.googleusercontent.com'
      }
    };
  },
  components: {
    WButton,
    Grid,
    Column,
    Paper,
    PaperText
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  watch: {
    user(newVal, oldVal) {
      if (newVal) {
        this.$router.push({ name: 'ProjectSelect' });
      }
    }
  },
  methods: {
    onSignInSuccess(googleUser) {
      this.$store.dispatch('authGoogle', googleUser);
    },
    onSignInError(error) {
      console.log('OH NOES', error);
    }
  }
};
</script>


<style scoped>

</style>
