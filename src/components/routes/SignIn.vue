<template>
  <div id="RouteSignIn">
    <g-signin-button
      :params="googleSignInParams"
      @success="onSignInSuccess"
      @error="onSignInError">
      Sign in with Google
    </g-signin-button>
    <h4><i>Currently only sign in with Google is supported</i></h4>
  </div>
</template>

<script>
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'SignIn',
  data () {
    return {
      googleSignInParams: {
        client_id: '558300683184-b9h5fh49dm03qo0lo6jd2pe71gbne98h.apps.googleusercontent.com'
      }
    }
  },
  components: {
    PaperWorkspace
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    user (newVal, oldVal) {
      if (newVal) {
        this.$router.push({ name: 'ProjectCreate' })
      }
    }
  },
  methods: {
    onSignInSuccess (googleUser) {
      this.$store.dispatch('authGoogle', googleUser)
    },
    onSignInError (error) {
      console.log('OH NOES', error)
    }
  }
}
</script>

<style scoped>
.padded {
  padding: 1rem;
}
</style>
