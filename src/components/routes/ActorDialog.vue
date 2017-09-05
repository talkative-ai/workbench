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
      return this.$store.state.rootNodes || new Set()
    },
    dialogs () {
      return this.$store.state.dialogsMapped || {}
    }
  }
}
</script>

<style scoped>
</style>
