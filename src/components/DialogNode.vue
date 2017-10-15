<template lang="pug">
  .DialogNode
    .wrap(
      @click="$router.push({ name: 'DialogHome', params: { id: $route.params.id, dialog_id: node.ID }})",
      :class="$route.params.dialog_id !== node.ID ? 'selectable' : ''"
    )
      .cover(v-if="!$route.params.linking_child")
        h1 edit dialog
      .cover(v-else-if="$route.params.dialog_id !== node.ID")
        h1 link dialog
      .cover.opaque(v-else)
        h1 linking
      .entry(v-for="(entry, index) in dialogs[node.ID].EntryInput" :class="childIteration ? 'child' : ''")
        | "{{ entry }}"
        span(v-if="index < dialogs[node.ID].EntryInput.length-1")
          | ,
      .ball(v-if="childIteration")
      .node-values
        .inner-values(v-for='(sound, index) of node.AlwaysExec.PlaySounds', :key='`sound-${node.ID}-${index}`')
          | {{ sound.Val }}
        .actions(v-if='node.ChildNodes')
          | await response
    .after-values-space(v-if='node.ChildNodes' :style="{ width: calculateAfterValuesSpaceWidth(node.ChildNodes.length) }")
    .child-nodes(v-if='node.ChildNodes')
      div(v-for='(nodeID, idx) of node.ChildNodes', :key='nodeID')
        dialog-node(:node='dialogs[nodeID]' childIteration="true")
</template>

<script>
import DialogNode from './DialogNode';

export default {
  name: 'dialog-node',
  props: ['node', 'childIteration'],
  components: {
    DialogNode
  },
  computed: {
    dialogs() {
      return this.$store.state.dialogsMapped || {};
    }
  },
  methods: {
    calculateAfterValuesSpaceWidth(childCount) {
      if (childCount === 1) return 0;
      else return `${((childCount - 1) * 300) + 1}pt`;
    }
  }
};
</script>

<style lang="scss" scoped>
.DialogNode {
  display: inline-flex;
  flex-direction: column;
  user-select: none;
  margin-top: -1px;
  width: 300pt;
}
.cover {
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: -1px;
  right: -1px;
  background-color: var(--color-paper-low-opacity);
  z-index: 10;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    color: $purple;
  }
  &:hover {
    opacity: 1;
    border: 1px solid $purple;
  }
  &.opaque {
    opacity: 1;
    border: 1px solid $purple;
  }
}
.actions {
  cursor: default;
  pointer-events: none;
  border: 1px solid $purple;
  display: inline-block;
  padding: 0.25rem;
  color: $purple;
  border-left: 20pt solid $purple;
}
.after-values-space {
  height: 2rem;
  border-left: 1px solid $purple;
  border-bottom: 1px solid $purple;
  margin-left: 10.5pt;
  margin-top: -1pt;
}
.ball {
  width: 0.25rem;
  height: 0.25rem;
  border: 0.25rem solid $purple;
  border-radius: 100%;
  position: absolute;
  display: inline-block;
  margin-left: -0.25rem;
  margin-top: -0.25rem;
}
.child-node-head {
  position: relative;
  margin: 0 0 1rem 0.25rem;
}
.wrap {
  padding-left: 10pt;
  border: 1px solid transparent;
  position: relative;
}
.selectable:hover {
  border: 1px solid $purple;
  cursor: pointer;
}
.inner-values {
  padding: 0.25rem;
  padding: 5pt 0.25rem 10pt 0.25rem;
  position: relative;
  left: -10pt;
}
.child-nodes {
  display: flex;
}
.child-node-head-nth {
  border-top: 1px solid $purple;
}
.entry {
  color: $purple;
  &.child {
    border-left: 1px solid $purple;
  }
  padding: 0.2rem;
}
</style>
