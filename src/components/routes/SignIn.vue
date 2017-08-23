<template>
  <div id="RouteSignIn">
    <PaperWorkspace>
      <div class="padded">
        <h1>Sign In!</h1>
        <h4><i>Currently only sign in with Google is supported</i></h4>
        <div class="g-signin2" data-onsuccess="onSignIn"></div>
      </div>
    </PaperWorkspace>
  </div>
</template>

<script>
import PaperWorkspace from '../PaperWorkspace'

export default {
  name: 'SignIn',
  components: {
    PaperWorkspace
  }
}
</script>

<style scoped>
.padded {
  padding: 1rem;
}
</style>
