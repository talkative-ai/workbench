<template lang="pug">
  #RouteActorDialog
    template(v-if="$store.state.dialogSiblings.length")
      h1(v-if="$route.params.linking_child") Select a dialog to link to
      h1(v-if="!$store.state.dialogChain.length") Select a conversation beginning
      .flex
        .chain(v-if="$store.state.dialogChain.length")
          h1 Conversation
          hr
          dialog-node(
            v-for='(node, idx) of $store.state.dialogChain'
            :key='node.ID'
            :node='dialogs[node.ID]'
            :recurse='false'
            @click="clickChain(idx)"
            :isChildIteration='idx > 0'
          )
        .nodes
          dialog-node(
            v-for='nodeID of $store.state.dialogSiblings'
            :key='nodeID'
            :node='dialogs[nodeID]'
            :recurse='ready && isSelected(nodeID)'
            :isSelected='isSelected(nodeID)'
            :resolve='readyResolve[nodeID]'
            :tallest='tallest'
            @click="clickNode({ nodeID })"
            @click-child="clickNode($event)"
          )
    w-button(
      v-else
      @click.native="$router.push({ name: 'DialogCreate', params: $route.params, is_root: true })"
    ) Create the first dialog
</template>

<script>
import DialogNode from '../DialogNode';
import WButton from '../elements/Button';

export default {
  name: 'ActorDialog',
  components: {
    DialogNode,
    WButton
  },
  data() {
    let readyPromises = [];
    let readyResolve = {};

    let data = {
      ready: false,
      readyPromises,
      readyResolve,
      tallest: 20
    };

    let nodes = this.$store.state.dialogSiblings.length ? this.$store.state.dialogSiblings : this.$store.state.rootNodes;

    for (let nodeID of nodes) {
      readyPromises.push(new Promise(resolve => {
        readyResolve[nodeID] = resolve;
      }));
    }

    Promise.all(readyPromises).then(results => {
      let tallest = results.reduce((total, rect) => Math.max(total, rect.height), 0);
      this.$set(data, 'tallest', tallest);
      this.$set(data, 'ready', true);
    });

    return data;
  },
  computed: {
    rootNodes() {
      return this.$store.state.rootNodes || [];
    },
    dialogs() {
      return this.$store.state.dialogsMapped || {};
    }
  },
  methods: {
    isSelected(nodeID = 0) {
      return (this.$store.state.actorSelectedDialogID[this.$route.params.id] || '').toString() === nodeID.toString();
    },
    clickNode(event) {
      this.$store.dispatch('selectNode', event);
    },
    clickChain(index) {
      this.$store.dispatch('selectChain', index);
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  color: var(--color-brand);
}
.flex {
  display: flex;
  align-items: flex-start;
}
.chain {
  width: 332pt;
  margin-right: 20pt;
  -webkit-box-shadow: 0pt 0pt 5pt black;
  box-shadow: 1pt 1pt 2pt rgba(0, 0, 0, 0.2);
  padding: 16pt;
  background-color: white;
}
.nodes {
  width: 100%;
  display: flex;
}
hr {
  color: var(--color-brand);
  opacity: 0.8;
}
</style>
