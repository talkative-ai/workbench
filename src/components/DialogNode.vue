<template lang="pug">
  .DialogNode
    .wrap(
      @click="mainClick()",
      :class="`${$route.params.dialog_id !== node.ID ? 'selectable' : ''}`"
      :id="`dialog-node-${node.ID}`"
      ref="node"
    )
      .cover(v-if="!$route.params.linking_child")
        h1(v-if="isChildIteration") zoom in
        h1(v-else-if="isSelected") edit dialog
        h1(v-else="isSelected") select dialog
      .cover(v-else-if="$route.params.dialog_id !== node.ID")
        h1 link dialog
      .cover.opaque(v-else)
        h1 linkingˆ
      .spacer(v-if="isChildIteration")
      .ball(v-if="isChildIteration")
      .entry-wrap
        .entry(v-for="(entry, index) in dialogs[node.ID].EntryInput" :class="isChildIteration ? 'child' : ''")
          | "{{ entry }}"
          span(v-if="index < dialogs[node.ID].EntryInput.length-1")
            | ,
      .node-values
        .inner-values.actor-vals(v-for='(sound, index) of node.AlwaysExec.PlaySounds', :key='`sound-${node.ID}-${index}`')
          | "{{ sound.Val }}"
        .actions(v-if='node.ChildNodes')
          | await response
        .actions.black(v-else)
          | end conversation
    template(v-if="recurse")
      .after-values-space(v-if='node.ChildNodes' :style="{ width: `${calculateWidth()}pt`, height: `${tallest - height + 35}px` }")
      .child-nodes(v-if='node.ChildNodes')
        div(v-for='(nodeID, idx) of node.ChildNodes', :key='nodeID')
          dialog-node(
            :node='dialogs[nodeID]',
            isChildIteration="true",
            :recurse='false'
          )
</template>

<script>
import DialogNode from './DialogNode';

export default {
  name: 'dialog-node',
  props: ['node', 'isChildIteration', 'recurse', 'isSelected', 'resolve', 'tallest'],
  components: {
    DialogNode
  },
  data() {
    return {
      height: 0
    };
  },
  mounted() {
    const rect = this.$refs.node.getBoundingClientRect();
    this.height = rect.height;
    if (this.resolve) {
      this.resolve(rect);
    }
  },
  computed: {
    dialogs() {
      return this.$store.state.dialogsMapped || {};
    }
  },
  methods: {
    calculateWidth() {
      if (!this.node.ChildNodes) return 0;
      return ((this.node.ChildNodes.length - 1) * 300) + 1;
    },
    mainClick() {
      this.$store.dispatch('selectNode', { nodeID: this.node.ID, isChild: this.isChildIteration });
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
  width: 301pt;
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
    cursor: pointer;
  }
  &.opaque {
    opacity: 1;
    cursor: default;
    border: 1px solid $purple;
  }
}
.entry-wrap {
  padding: 2.5pt 0;
}
.spacer {
  height: 20pt;
  border-left: 1px solid $purple;
}
.actor-vals {
  color: $purple;
  border-left: 1px solid $purple;
}
.actions {
  cursor: default;
  pointer-events: none;
  display: inline-block;
  padding: 0.25rem;
  background-color: $purple;
  color: white;
}
.after-values-space {
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
.inner-values {
  padding: 0.25rem;
  padding: 5pt 0.25rem 10pt 0.25rem;
}
.child-nodes {
  display: flex;
}
.child-node-head-nth {
  border-top: 1px solid $purple;
}
.entry {
  position: relative;
  left: -10pt;
  padding: 5pt 0;
}
.black {
  background-color: black;
}
</style>
