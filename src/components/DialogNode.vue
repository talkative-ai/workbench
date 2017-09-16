<template lang="pug">
  .DialogNode
    .node-values(@click="$router.push({ name: 'DialogHome', params: { id: $route.params.id, dialog_id: node.ID }})")
      .inner-values(v-for='(sound, index) of node.AlwaysExec.PlaySounds', :key='`sound-${node.ID}-${index}`')
        | {{ sound.Val }}
      .actions(v-if='node.ChildNodes')
        | await response
    .after-values-space(v-if='node.ChildNodes')
    .child-nodes(v-if='node.ChildNodes')
      div(v-for='(nodeID, idx) of node.ChildNodes', :key='nodeID')
        div(:class="`child-node-head ${idx < node.ChildNodes.length-1 ? 'child-node-head-nth' : 'child-node-head-final'}`")
          .entry "{{ dialogs[nodeID].EntryInput[0] }}"
          .ball
        dialog-node(:node='dialogs[nodeID]')
</template>

<script>
import DialogNode from './DialogNode'

export default {
  name: 'dialog-node',
  props: ['node'],
  components: {
    DialogNode
  },
  computed: {
    dialogs () {
      return this.$store.state.dialogsMapped || {}
    }
  }
}
</script>

<style lang="scss" scoped>
.DialogNode {
  display: inline-flex;
  flex-direction: column;
  user-select: none;
  width: 25vw;
}
.actions {
  cursor: default;
  pointer-events: none;
  border: 1px solid $purple;
  display: inline-block;
  padding: 0.25rem;
}
.after-values-space {
  height: 2rem;
  border-left: 1px solid $purple;
  margin-left: 0.25rem;
}
.ball {
  width: 0.25rem;
  height: 0.25rem;
  border: 0.25rem solid $purple;
  border-radius: 100%;
  position: absolute;
  left: -0.25rem;
}
.child-node-head {
  position: relative;
  margin: 0 0 1rem 0.25rem;
}
.node-values {
  border: 1px solid transparent;
  border-bottom: none;
  padding-left: 0.20rem;
  &:hover {
    border: 1px solid $purple;
    cursor: pointer;
  }
}
.inner-values {
  padding: 0.25rem;
}
.child-nodes {
  display: flex;
}
.child-node-head-nth {
  border-top: 1px solid $purple;
}
.entry {
  color: $purple;
  border-left: 1px solid $purple;
  padding: 0.2rem;
}
</style>
