<template lang="pug">
  .DialogNode
    .wrap(
      @click="$emit('click')",
      :class="`${$route.params.dialog_id !== node.ID ? 'selectable' : ''}`"
      :id="`dialog-node-${node.ID}`"
      ref="node"
    )
      .cover-wrap
        .cover(v-if="!$route.params.linking_child" :class="isSelected ? 'selected' : ''")
          h1(v-if="!isSelected")
            IconButton(name="search")
            | &nbsp;select
        .cover(v-else-if="$route.params.dialog_id !== node.ID")
          h1 link dialog
        .cover.opaque(v-else)
          h1 linking
        .edit-bar
          IconButton(name="pencil" label="edit")
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
      .after-values-space(v-if='node.ChildNodes' :style="{ width: `${calculateWidth()}px`, height: `${tallest - height + 35}px` }")
      .child-nodes(v-if='node.ChildNodes')
        div(v-for='(nodeID, idx) of node.ChildNodes', :key='nodeID')
          DialogNode(
            :node='dialogs[nodeID]',
            isChildIteration="true",
            :recurse='false'
            @click="$emit('click-child', { nodeID, isChild: true })"
            @click-child="$emit('click-child', { nodeID, isChild: true })"
          )
</template>

<script>
export default {
  name: 'DialogNode',
  props: ['node', 'isChildIteration', 'recurse', 'isSelected', 'resolve', 'tallest'],
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
      if (!this.node.ChildNodes) return 1;
      return ((this.node.ChildNodes.length - 1) * 400) + 1;
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
  width: 400px;
}
.cover {
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: -1px;
  width: 401px;
  background-color: var(--color-paper-low-opacity);
  z-index: 10;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    color: $purple;
  }
  &.opaque {
    opacity: 1;
    cursor: default;
    border: 1px solid $purple;
  }
}
.cover-wrap {
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: -1px;
  z-index: 10;
  &:hover {
    z-index: 20;
    .cover {
      opacity: 1;
      border: 1px solid $purple;
      cursor: pointer;
      &.selected {
        cursor: default;
      }
    }
    .edit-bar {
      opacity: 1;
    }
  }
}
.edit-bar {
  bottom: -31pt;
  position: absolute;
  left: 0;
  right: 0;
  width: 400px;
  opacity: 0;
  height: 30pt;
  display: flex;
  align-items: center;
  background-color: var(--color-paper);
  box-shadow: 0 0 5pt rgba(0,0,0,0.2);
  padding-left: 10pt;
  z-index: 10;
}
.entry-wrap {
  padding: 2.5pt 0;
}
.spacer {
  height: 20pt;
  border-left: 1px solid $purple;
  margin-top: -1px;
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
  margin-left: 11pt;
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
