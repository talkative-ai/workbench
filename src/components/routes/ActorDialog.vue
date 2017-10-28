<template lang="pug">
  #RouteActorDialog
    template(v-if="$store.state.dialogSiblings.length")
      h1(v-if="$route.params.linking_child") Select a dialog to link to
      h1(v-if="!$store.state.dialogChain.length") Select a conversation beginning
      .flex
        .flex-column
          .chain(v-if="$store.state.dialogChain.length")
            h1 Conversation
            hr
            DialogNode(
              v-for='(dialog, idx) of $store.state.dialogChain'
              :key='dialog.ID'
              :dialog='dialogs[dialog.ID]'
              :recurse='false'
              @click="clickChain(idx)"
              :isChildIteration='idx > 0'
              :isSelected='isSelected(dialog.ID)'
            )
          .space
        .dialogs(:style="{ 'min-width': `${(($store.state.dialogSiblings.length + 1) * 400)}px` }")
          DialogNode(
            v-for='dialogID of $store.state.dialogSiblings'
            :key='dialogID'
            :dialog='dialogs[dialogID]'
            :recurse='ready && isSelected(dialogID)'
            :isSelected='isSelected(dialogID)'
            :resolve='readyResolve[dialogID]'
            :tallest='tallest'
            @click="clickDialog({ dialogID })"
            @click-child="clickDialog($event)"
            :newConversation="true"
          )
          DummyNode(v-if="!$store.state.newDialog" @click.native="$store.dispatch('startNewConversation')")
            IconButton(name="plus" flat)
            | new
    w-button(
      v-else
      @click.native="$router.push({ name: 'DialogCreate', params: $route.params, is_root: true })"
    ) Create the first dialog
</template>

<script>
import DummyNode from '../DummyNode';
export default {
  name: 'ActorDialog',
  components: {
    DummyNode
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

    let dialogs = this.$store.state.dialogSiblings.length ? this.$store.state.dialogSiblings : this.$store.state.rootDialogs;

    for (let dialogID of dialogs) {
      readyPromises.push(new Promise(resolve => {
        readyResolve[dialogID] = resolve;
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
    rootDialogs() {
      return this.$store.state.rootDialogs || [];
    },
    dialogs() {
      return this.$store.state.dialogsMapped || {};
    }
  },
  methods: {
    isSelected(dialogID = 0) {
      return (this.$store.state.actorSelectedDialogID[this.$route.params.id] || '').toString() === dialogID.toString();
    },
    clickDialog(event) {
      this.$store.dispatch('selectDialog', event);
    },
    clickChain(index) {
      this.$store.dispatch('selectChain', index);
    }
  }
};
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  color: var(--color-brand);
}
.flex {
  display: flex;
  align-items: flex-start;
}
.flex-column {
  flex-direction: column;
}
.chain {
  width: 332pt;
  margin-right: 20pt;
  -webkit-box-shadow: 0pt 0pt 5pt black;
  box-shadow: 1pt 1pt 2pt rgba(0, 0, 0, 0.2);
  padding: 16pt;
  background-color: white;
}
.dialogs {
  width: 100%;
  display: flex;
}
hr {
  color: var(--color-brand);
  opacity: 0.8;
}
.space {
  height: 50pt;
}
</style>
