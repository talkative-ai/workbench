<template lang="pug">
  #RouteActorDialog
    h1(v-if="$route.params.linking_child") Select a dialog to link to
    dialog-node(
      v-if='rootNodes.length > 0'
      v-for='rootID of rootNodes'
      :key='rootID'
      :node='dialogs[rootID]'
    )
    button.button(
      @click="$router.push({ name: 'DialogCreate', params: $route.params, is_root: true })"
      v-if='!rootNodes.length'
    ) Create the first dialog
</template>

<script>
import DialogNode from '../DialogNode';

export default {
  name: 'ActorDialog',
  components: {
    DialogNode
  },
  computed: {
    rootNodes() {
      console.log(this.$store.state.rootNodes);
      return this.$store.state.rootNodes || [];
    },
    dialogs() {
      return this.$store.state.dialogsMapped || {};
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  color: var(--color-brand);
}
</style>
