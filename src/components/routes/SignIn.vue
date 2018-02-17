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
        client_id: '978478335435-p23cf8b45ma06cgucuhtq4205ftq2drq.apps.googleusercontent.com'
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
    }
    // onSignInError(error) {
    //   // TODO: Handle this
    // }
  }
};
</script>


<style scoped>
.error {
  font-size: 1.5rem;
  color: red;
}
</style>
