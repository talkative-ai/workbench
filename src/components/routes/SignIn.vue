<template lang="pug">
  paper#RouteSignIn
    g-signin-button(
      :params="googleSignInParams"
      @success="onSignInSuccess"
      @error="onSignInError"
    )
      | Sign in with Google
    h4
      i Currently only sign in with Google is supported
</template>

<script>
import Paper from '../Paper'

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
    Paper
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    user (newVal, oldVal) {
      if (newVal) {
        this.$router.push({ name: 'ProjectSelect' })
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
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
  cursor: pointer;
}
</style>
