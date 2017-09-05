<template>
  <div id="RouteActorDialog">
    <DialogNode v-for="rootID of rootNodes" :key="rootID" :node="dialogs[rootID]" />
  </div>
</template>

<script>
import DialogNode from '../DialogNode'

export default {
  name: 'ActorDialog',
  components: {
    DialogNode
  },
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
