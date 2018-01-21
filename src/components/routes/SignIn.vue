<template>
  <grid gutter id="RouteSignIn">
    <column menu="menu">&nbsp;</column>
    <paper>
      <paper-text>
          <g-signin-button
            :params="googleSignInParams"
            @success="onSignInSuccess"
            @error="onSignInError">
            <w-button class="Headline" outline="outline" large="large">
              Sign in with Google
            </w-button>
          </g-signin-button>
        <p class="u-marginT3 u-colorTextLight">Currently only sign in with Google is supported.</p>
        <div v-if="error" class="error">
          {{ knownErrors[error.message] || error.message }}
        </div>
      </paper-text>
    </paper>
  </grid>
</template>


<script>
export default {
  name: 'SignIn',
  data() {
    return {
      googleSignInParams: {
        client_id: '693388894852-2s2q0ggfj09c5mq094gpdbppugce944m.apps.googleusercontent.com'
      },
      error: {},
      knownErrors: {
        'not_whitelisted': "Sorry, your account hasn't been whitelisted for the beta."
      }
    };
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
      this.$store.dispatch('master/authGoogle', googleUser)
      .catch(err => {
        this.error = err;
      });
    },
    onSignInError(error) {
      console.log('OH NOES', error);
    }
  }
};
</script>


<style scoped>
.error {
  font-size: 1.5rem;
  color: red;
}
</style>
