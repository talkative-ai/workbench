<template>
  <div id="RouteDialogEditor">
    <div v-for="rootID of rootNodes" :key="rootID">
      {{ dialogs[rootID].Always.PlaySounds[0].Values }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogEditor',
  computed: {
    rootNodes () {
      console.log(this.$store.state.rootNodes)
      return this.$store.state.rootNodes || new Set()
    },
    dialogs () {
      console.log(this.$store.state.dialogsMapped)
      return this.$store.state.dialogsMapped || {}
    }
  }
}
</script>

<style scoped>
</style>
